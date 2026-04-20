'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Article, TocItem, ArticleTag, Block } from '@/db/schema'

interface TocEntry { anchorId: string; labelFr: string; labelEn: string; sortOrder: number }
interface TagEntry  { nameFr: string; nameEn: string }

interface ArticleEditorProps {
  article?: Article
  toc?: TocItem[]
  tags?: ArticleTag[]
  mode: 'new' | 'edit'
}

/* ─── Markdown helpers ─── */
function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    if (b.type === 'p') return b.text.replace(/<strong>(.*?)<\/strong>/g, '**$1**').replace(/<em>(.*?)<\/em>/g, '*$1*').replace(/<code>(.*?)<\/code>/g, '`$1`')
    if (b.type === 'h2') return `## ${typeof b.text === 'string' ? b.text : b.text.fr}`
    if (b.type === 'quote') return `> ${b.text}`
    if (b.type === 'list') return b.items.map(i => `- ${i}`).join('\n')
    if (b.type === 'code') return `\`\`\`${b.lang}\n${b.code}\n\`\`\``
    return ''
  }).join('\n\n')
}

function markdownToBlocks(md: string): Block[] {
  const lines = md.split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }
    if (line.startsWith('## ')) {
      const text = line.slice(3)
      const id = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
      blocks.push({ type: 'h2', id, text: { fr: text, en: text } })
      i++
    } else if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', text: inlineMarkdown(line.slice(2)) })
      i++
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'js'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') })
      i++
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(inlineMarkdown(lines[i].trim().slice(2))); i++ }
      blocks.push({ type: 'list', items })
    } else {
      const paraLines: string[] = []
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('>') && !lines[i].startsWith('```') && !lines[i].startsWith('- ')) {
        paraLines.push(lines[i].trim()); i++
      }
      if (paraLines.length) blocks.push({ type: 'p', text: inlineMarkdown(paraLines.join(' ')) })
    }
  }
  return blocks
}

function renderPreview(blocks: Block[]): string {
  return blocks.map(b => {
    if (b.type === 'p') return `<p>${b.text}</p>`
    if (b.type === 'h2') { const t = typeof b.text === 'string' ? b.text : b.text.fr; return `<h2 id="${b.id}">${t}</h2>` }
    if (b.type === 'quote') return `<blockquote><p>${b.text}</p></blockquote>`
    if (b.type === 'list') return `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`
    if (b.type === 'code') return `<pre><code class="lang-${b.lang}">${b.code.replace(/</g, '&lt;')}</code></pre>`
    return ''
  }).join('\n')
}

/* ─── Component ─── */
export function ArticleEditor({ article, toc: initialToc, tags: initialTags, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generatingMeta, setGeneratingMeta] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    slug: article?.slug ?? '',
    issue: article?.issue ?? 1,
    date: article?.date ?? new Date().toISOString().split('T')[0],
    readMin: article?.readMin ?? 5,
    featured: article?.featured ?? false,
    published: article?.published ?? false,
    titleFr: article?.titleFr ?? '',
    titleEn: article?.titleEn ?? '',
    dekFr: article?.dekFr ?? '',
    dekEn: article?.dekEn ?? '',
    bodyFr: article?.bodyFr ? blocksToMarkdown(article.bodyFr as Block[]) : '',
    bodyEn: article?.bodyEn ? blocksToMarkdown(article.bodyEn as Block[]) : '',
  })

  const [tocEntries, setTocEntries] = useState<TocEntry[]>(
    initialToc?.map(t => ({ anchorId: t.anchorId, labelFr: t.labelFr, labelEn: t.labelEn, sortOrder: t.sortOrder })) ?? []
  )
  const [tagEntries, setTagEntries] = useState<TagEntry[]>(
    initialTags?.map(t => ({ nameFr: t.nameFr, nameEn: t.nameEn })) ?? []
  )
  const [newTagFr, setNewTagFr] = useState('')
  const [newTagEn, setNewTagEn] = useState('')

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  /* ─── Régénérer via IA ─── */
  const handleRegenMeta = async () => {
    setGeneratingMeta(true)
    try {
      const res = await fetch('/api/dashboard/articles/regen-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFr: form.titleFr,
          titleEn: form.titleEn,
          bodyFr: markdownToBlocks(form.bodyFr),
          bodyEn: markdownToBlocks(form.bodyEn),
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.toc) setTocEntries(data.toc)
      if (data.tags) {
        const fr: string[] = data.tags.fr ?? []
        const en: string[] = data.tags.en ?? []
        const len = Math.max(fr.length, en.length)
        setTagEntries(Array.from({ length: len }, (_, i) => ({ nameFr: fr[i] ?? '', nameEn: en[i] ?? '' })))
      }
    } catch {
      // silently fail
    } finally {
      setGeneratingMeta(false)
    }
  }

  /* ─── Sauvegarde ─── */
  const handleSave = async (publish?: boolean) => {
    setSaving(true)
    setSaved(false)
    setError('')

    const slug = form.slug.trim() ||
      form.titleFr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

    try {
      const payload = {
        ...form,
        slug,
        published: publish !== undefined ? publish : form.published,
        bodyFr: markdownToBlocks(form.bodyFr),
        bodyEn: markdownToBlocks(form.bodyEn),
        toc: tocEntries,
        tags: tagEntries,
      }
      const url = mode === 'new' ? '/api/dashboard/articles' : `/api/dashboard/articles/${article!.id}`
      const res = await fetch(url, {
        method: mode === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (!form.slug.trim()) set('slug', slug)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      if ((publish ?? form.published) && tocEntries.length === 0) {
        setGeneratingMeta(true)
        setTimeout(() => setGeneratingMeta(false), 8000)
      }
      if (mode === 'new') router.push(`/dashboard/articles/${data.id}`)
      else router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  const previewHtml = renderPreview(markdownToBlocks(activeTab === 'fr' ? form.bodyFr : form.bodyEn))

  return (
    <div>
      {/* ─── Header ─── */}
      <header className="editor-header">
        <div>
          <p className="editor-kicker">{mode === 'new' ? 'Nouvel article' : `Éditer · №${article?.issue}`}</p>
          <h1 className="editor-heading">{mode === 'new' ? 'Créer un article' : (form.titleFr || 'Sans titre')}</h1>
        </div>
        <div className="editor-header-actions">
          <button onClick={() => handleSave(false)} disabled={saving} className="dash-btn-ghost">
            {saving ? <span className="editor-saving">…</span> : 'Enregistrer brouillon'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="dash-btn-primary">
            {form.published ? 'Mettre à jour' : 'Publier'}
          </button>
        </div>
      </header>

      {error && <div className="editor-error">{error}</div>}
      {saved && <div className="editor-saved">✓ Enregistré</div>}
      {generatingMeta && (
        <div className="editor-generating">
          <span className="editor-saving">◆</span>{' '}DeepSeek génère le sommaire et les tags…
        </div>
      )}

      <div className="editor-layout">
        {/* ─── Corps ─── */}
        <div>
          <div className="editor-tabs">
            {(['fr', 'en'] as const).map(lang => (
              <button key={lang} onClick={() => setActiveTab(lang)} className={`editor-tab${activeTab === lang ? ' active' : ''}`}>
                {lang.toUpperCase()}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={() => setPreview(v => !v)} className={`editor-preview-btn${preview ? ' active' : ''}`}>
              {preview ? '← Éditer' : 'Aperçu →'}
            </button>
          </div>

          <input value={activeTab === 'fr' ? form.titleFr : form.titleEn} onChange={e => set(activeTab === 'fr' ? 'titleFr' : 'titleEn', e.target.value)} placeholder={activeTab === 'fr' ? 'Titre en français…' : 'Title in English…'} className="editor-input editor-title" />
          <input value={activeTab === 'fr' ? form.dekFr : form.dekEn} onChange={e => set(activeTab === 'fr' ? 'dekFr' : 'dekEn', e.target.value)} placeholder={activeTab === 'fr' ? 'Accroche (dek)…' : 'Standfirst (dek)…'} className="editor-input editor-dek" />

          {preview ? (
            <div className="article-body editor-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <textarea value={activeTab === 'fr' ? form.bodyFr : form.bodyEn} onChange={e => set(activeTab === 'fr' ? 'bodyFr' : 'bodyEn', e.target.value)} placeholder={`Écris en Markdown…\n\n## Titre de section\n\nParagraphe de texte.\n\n> Citation\n\n\`\`\`js\nconst x = 1\n\`\`\``} className="editor-textarea" />
          )}
        </div>

        {/* ─── Sidebar ─── */}
        <aside>
          {/* Métadonnées */}
          <div className="editor-meta-panel">
            <div className="editor-meta-title">Métadonnées</div>
            <label className="editor-label">Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} className="editor-input-sm" placeholder="mon-article" />
            <label className="editor-label">Numéro (issue)</label>
            <input type="number" value={form.issue} onChange={e => set('issue', +e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Temps de lecture (min)</label>
            <input type="number" value={form.readMin} onChange={e => set('readMin', +e.target.value)} className="editor-input-sm" />
            <div className="editor-checkboxes">
              <label className="editor-checkbox">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                <span>Article à la une</span>
              </label>
              <label className="editor-checkbox">
                <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
                <span>Publié</span>
              </label>
            </div>
          </div>

          {/* ─── Tags ─── */}
          <div className="editor-meta-panel editor-meta-panel--mt">
            <div className="editor-meta-section-head">
              <div className="editor-meta-title" style={{ margin: 0 }}>Tags</div>
              <button onClick={handleRegenMeta} disabled={generatingMeta} className="editor-regen-btn" title="Régénérer via DeepSeek">
                {generatingMeta ? <span className="editor-saving">◆</span> : '↺ IA'}
              </button>
            </div>

            <div className="editor-tags-list">
              {tagEntries.map((tag, i) => (
                <div key={i} className="editor-tag-row">
                  <input
                    value={tag.nameFr}
                    onChange={e => setTagEntries(t => t.map((x, j) => j === i ? { ...x, nameFr: e.target.value } : x))}
                    placeholder="FR"
                    className="editor-input-sm editor-tag-input"
                  />
                  <input
                    value={tag.nameEn}
                    onChange={e => setTagEntries(t => t.map((x, j) => j === i ? { ...x, nameEn: e.target.value } : x))}
                    placeholder="EN"
                    className="editor-input-sm editor-tag-input"
                  />
                  <button onClick={() => setTagEntries(t => t.filter((_, j) => j !== i))} className="editor-remove-btn" aria-label="Supprimer">×</button>
                </div>
              ))}
            </div>

            <div className="editor-tag-add">
              <input value={newTagFr} onChange={e => setNewTagFr(e.target.value)} placeholder="FR" className="editor-input-sm editor-tag-input" onKeyDown={e => { if (e.key === 'Enter' && newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }} />
              <input value={newTagEn} onChange={e => setNewTagEn(e.target.value)} placeholder="EN" className="editor-input-sm editor-tag-input" onKeyDown={e => { if (e.key === 'Enter' && newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }} />
              <button
                onClick={() => { if (newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }}
                className="editor-add-btn"
              >+</button>
            </div>
          </div>

          {/* ─── TOC ─── */}
          <div className="editor-meta-panel editor-meta-panel--mt">
            <div className="editor-meta-section-head">
              <div className="editor-meta-title" style={{ margin: 0 }}>Sommaire (TOC)</div>
              <button onClick={handleRegenMeta} disabled={generatingMeta} className="editor-regen-btn" title="Régénérer via DeepSeek">
                {generatingMeta ? <span className="editor-saving">◆</span> : '↺ IA'}
              </button>
            </div>

            {tocEntries.length === 0 && (
              <p className="editor-toc-empty">
                Aucune entrée. Publie l'article ou clique sur ↺ IA.
              </p>
            )}

            <div className="editor-toc-list">
              {tocEntries.map((item, i) => (
                <div key={i} className="editor-toc-row">
                  <div className="editor-toc-anchor">#{item.anchorId}</div>
                  <input
                    value={item.labelFr}
                    onChange={e => setTocEntries(t => t.map((x, j) => j === i ? { ...x, labelFr: e.target.value } : x))}
                    placeholder="Label FR"
                    className="editor-input-sm"
                  />
                  <input
                    value={item.labelEn}
                    onChange={e => setTocEntries(t => t.map((x, j) => j === i ? { ...x, labelEn: e.target.value } : x))}
                    placeholder="Label EN"
                    className="editor-input-sm"
                  />
                  <button onClick={() => setTocEntries(t => t.filter((_, j) => j !== i))} className="editor-remove-btn" aria-label="Supprimer">×</button>
                </div>
              ))}
            </div>

            {/* Ajouter une entrée manuellement */}
            <button
              onClick={() => setTocEntries(t => [...t, { anchorId: '', labelFr: '', labelEn: '', sortOrder: t.length }])}
              className="editor-add-toc-btn"
            >
              + Ajouter une entrée
            </button>
          </div>

          {/* Aide Markdown */}
          <div className="editor-meta-panel editor-meta-panel--mt">
            <div className="editor-meta-title">Markdown</div>
            <div className="editor-md-help">
              <div><code>## Titre</code> → H2</div>
              <div><code>&gt; texte</code> → Citation</div>
              <div><code>- item</code> → Liste</div>
              <div><code>```js</code> → Code</div>
              <div><code>**gras**</code> → Gras</div>
              <div><code>*italique*</code> → Italique</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
