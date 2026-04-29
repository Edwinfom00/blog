'use client'

import { useState, useRef, useCallback, useMemo, useEffect, Component, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Article, TocItem, ArticleTag, Block } from '@/db/schema'

interface TocEntry { anchorId: string; labelFr: string; labelEn: string; sortOrder: number }
interface TagEntry  { nameFr: string; nameEn: string }
interface ArticleEditorProps {
  article?: Article; toc?: TocItem[]; tags?: ArticleTag[]; mode: 'new' | 'edit'
}

/* ─── Markdown helpers ─── */

// On ne fait AUCUN traitement inline au moment de la saisie
// Le texte est stocké brut et rendu tel quel dans les blocs
function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    if (b.type === 'p') return b.text
    if (b.type === 'h2') return `## ${typeof b.text === 'string' ? b.text : b.text.fr}`
    if (b.type === 'quote') return `> ${b.text}`
    if (b.type === 'list') return b.items.map(i => `- ${i}`).join('\n')
    if (b.type === 'code') return `\`\`\`${b.lang}\n${b.code}\n\`\`\``
    return ''
  }).join('\n\n')
}

function safeParseBlocks(md: string): Block[] {
  if (!md?.trim()) return []
  try {
    const lines = md.split('\n')
    const blocks: Block[] = []
    let i = 0
    while (i < lines.length && blocks.length < 300) {
      const line = lines[i].trim()
      if (!line) { i++; continue }
      if (line.startsWith('## ')) {
        const txt = line.slice(3).trim()
        const id = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || `h2-${i}`
        blocks.push({ type: 'h2', id, text: { fr: txt, en: txt } }); i++
      } else if (line.startsWith('> ')) {
        // Texte brut — pas de regex
        blocks.push({ type: 'quote', text: line.slice(2).trim() }); i++
      } else if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'js'; const codeLines: string[] = []; i++
        let c = 0
        while (i < lines.length && !lines[i].startsWith('```') && c < 200) { codeLines.push(lines[i]); i++; c++ }
        if (i < lines.length && lines[i].startsWith('```')) i++
        blocks.push({ type: 'code', lang, code: codeLines.join('\n') })
      } else if (line.startsWith('- ')) {
        const items: string[] = []; let c = 0
        // Texte brut — pas de regex
        while (i < lines.length && lines[i].trim().startsWith('- ') && c < 50) { items.push(lines[i].trim().slice(2)); i++; c++ }
        if (items.length) blocks.push({ type: 'list', items })
      } else {
        const paraLines: string[] = []; let c = 0
        while (
          i < lines.length &&
          lines[i].trim() &&
          !lines[i].trim().startsWith('## ') &&
          !lines[i].trim().startsWith('> ') &&
          !lines[i].trim().startsWith('```') &&
          !lines[i].trim().startsWith('- ') &&
          c < 20
        ) {
          const l = lines[i].trim()
          paraLines.push(l.startsWith('# ') ? l.slice(2) : l)
          i++; c++
        }
        if (paraLines.length) blocks.push({ type: 'p', text: paraLines.join(' ') })
        else i++ // ligne orpheline — avancer quoi qu'il arrive
      }
    }
    return blocks
  } catch { return [] }
}

function renderPreview(blocks: Block[]): string {
  // Le texte des blocs contient déjà du HTML (inlineMarkdown côté serveur)
  // On échappe uniquement le code, pas le contenu des autres blocs
  const escCode = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  return blocks.slice(0, 100).map(b => {
    if (b.type === 'p') return `<p>${b.text}</p>`
    if (b.type === 'h2') { const t = typeof b.text === 'string' ? b.text : b.text.fr; return `<h2 id="${b.id}">${t}</h2>` }
    if (b.type === 'quote') return `<blockquote><p>${b.text}</p></blockquote>`
    if (b.type === 'list') return `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`
    if (b.type === 'code') return `<pre><code class="lang-${b.lang}">${escCode(b.code)}</code></pre>`
    return ''
  }).join('\n')
}

/* ─── Textarea natif — zéro React ─── */
function NativeTextarea({ defaultValue, placeholder, visible, textareaRef }: {
  defaultValue: string
  placeholder: string
  visible: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  // On utilise useEffect pour initialiser la valeur une seule fois
  // Le textarea est ensuite entièrement géré par le DOM natif
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value === '') {
      textareaRef.current.value = defaultValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionnellement vide — on ne veut JAMAIS re-synchroniser

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className="editor-textarea"
      style={{ display: visible ? 'block' : 'none' }}
      // Pas de value, pas de onChange, pas de onInput
      // Le navigateur gère tout nativement
    />
  )
}

/* ─── Parse côté serveur — zéro calcul dans le navigateur ─── */
async function parseOnServer(fr: string, en: string): Promise<{ fr: any[], en: any[] }> {
  try {
    const res = await fetch('/api/dashboard/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fr, en }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    return res.json()
  } catch (e) {
    console.error('[parseOnServer] failed:', e)
    // Fallback : parser côté client en dernier recours
    return {
      fr: safeParseBlocks(fr),
      en: safeParseBlocks(en),
    }
  }
}

/* ─── Error Boundary ─── */
class EditorErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) return (
      <div className="editor-error">
        Erreur : {this.state.error}
        <button onClick={() => this.setState({ error: null })} style={{ marginLeft: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Réessayer</button>
      </div>
    )
    return this.props.children
  }
}

export function ArticleEditor(props: ArticleEditorProps) {
  return <EditorErrorBoundary><ArticleEditorInner {...props} /></EditorErrorBoundary>
}

function ArticleEditorInner({ article, toc: initialToc, tags: initialTags, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr')
  const [preview, setPreview] = useState(false)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generatingMeta, setGeneratingMeta] = useState(false)
  const [error, setError] = useState('')

  const [slug, setSlug] = useState(article?.slug ?? '')
  const [issue, setIssue] = useState(article?.issue ?? 1)
  const [date, setDate] = useState(article?.date ?? new Date().toISOString().split('T')[0])
  const [readMin, setReadMin] = useState(article?.readMin ?? 5)
  const [featured, setFeatured] = useState(article?.featured ?? false)
  const [published, setPublished] = useState(article?.published ?? false)
  const [titleFr, setTitleFr] = useState(article?.titleFr ?? '')
  const [titleEn, setTitleEn] = useState(article?.titleEn ?? '')
  const [dekFr, setDekFr] = useState(article?.dekFr ?? '')
  const [dekEn, setDekEn] = useState(article?.dekEn ?? '')

  const initBodyFr = useRef(article?.bodyFr ? blocksToMarkdown(article.bodyFr as Block[]) : '')
  const initBodyEn = useRef(article?.bodyEn ? blocksToMarkdown(article.bodyEn as Block[]) : '')
  const textareaFr = useRef<HTMLTextAreaElement>(null)
  const textareaEn = useRef<HTMLTextAreaElement>(null)

  // Preview blocks — calculés seulement au clic "Aperçu"
  const [previewBlocks, setPreviewBlocks] = useState<Block[]>([])
  const previewHtml = useMemo(() => renderPreview(previewBlocks), [previewBlocks])

  const togglePreview = useCallback(async () => {
    console.log('[togglePreview] called, preview=', preview)
    if (!preview) {
      setLoadingPreview(true)
      const fr = textareaFr.current?.value ?? initBodyFr.current
      const en = textareaEn.current?.value ?? initBodyEn.current
      console.log('[togglePreview] fetching parse, fr length=', fr.length)
      const result = await parseOnServer(fr, en)
      console.log('[togglePreview] parse result=', result)
      setPreviewBlocks(activeTab === 'fr' ? result.fr : result.en)
      setLoadingPreview(false)
      setPreview(true)
    } else {
      setPreview(false)
    }
  }, [preview, activeTab])

  const [tocEntries, setTocEntries] = useState<TocEntry[]>(
    initialToc?.map(t => ({ anchorId: t.anchorId, labelFr: t.labelFr, labelEn: t.labelEn, sortOrder: t.sortOrder })) ?? []
  )
  const [tagEntries, setTagEntries] = useState<TagEntry[]>(
    initialTags?.map(t => ({ nameFr: t.nameFr, nameEn: t.nameEn })) ?? []
  )
  const [newTagFr, setNewTagFr] = useState('')
  const [newTagEn, setNewTagEn] = useState('')

  const handleRegenMeta = async () => {
    setGeneratingMeta(true)
    try {
      const bodyFr = textareaFr.current?.value ?? initBodyFr.current
      const bodyEn = textareaEn.current?.value ?? initBodyEn.current
      const parsed = await parseOnServer(bodyFr, bodyEn)
      const res = await fetch('/api/dashboard/articles/regen-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleFr, titleEn, bodyFr: parsed.fr, bodyEn: parsed.en }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.toc) setTocEntries(data.toc)
      if (data.tags) {
        const fr: string[] = data.tags.fr ?? [], en: string[] = data.tags.en ?? []
        setTagEntries(Array.from({ length: Math.max(fr.length, en.length) }, (_, i) => ({ nameFr: fr[i] ?? '', nameEn: en[i] ?? '' })))
      }
    } catch { /* silently fail */ }
    finally { setGeneratingMeta(false) }
  }

  const handleSave = async (publish?: boolean) => {
    setSaving(true); setSaved(false); setError('')
    // Déporter le parsing hors du thread de rendu
    await new Promise<void>(resolve => setTimeout(resolve, 0))
    const bodyFr = textareaFr.current?.value ?? initBodyFr.current
    const bodyEn = textareaEn.current?.value ?? initBodyEn.current
    const finalSlug = slug.trim() || titleFr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    try {
      const parsed = await parseOnServer(bodyFr, bodyEn)
      const payload = {
        slug: finalSlug, issue, date, readMin, featured,
        published: publish !== undefined ? publish : published,
        titleFr, titleEn, dekFr, dekEn,
        bodyFr: parsed.fr,
        bodyEn: parsed.en,
        toc: tocEntries, tags: tagEntries,
      }
      const url = mode === 'new' ? '/api/dashboard/articles' : `/api/dashboard/articles/${article!.id}`
      const res = await fetch(url, { method: mode === 'new' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (!slug.trim()) setSlug(finalSlug)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
      if ((publish ?? published) && tocEntries.length === 0) { setGeneratingMeta(true); setTimeout(() => setGeneratingMeta(false), 8000) }
      if (mode === 'new') router.push(`/dashboard/articles/${data.id}`)
      else router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <header className="editor-header">
        <div>
          <p className="editor-kicker">{mode === 'new' ? 'Nouvel article' : `Éditer · №${article?.issue}`}</p>
          <h1 className="editor-heading">{mode === 'new' ? 'Créer un article' : (titleFr || 'Sans titre')}</h1>
        </div>
        <div className="editor-header-actions">
          <button onClick={() => handleSave(false)} disabled={saving} className="dash-btn-ghost">
            {saving ? <span className="editor-saving">…</span> : 'Enregistrer brouillon'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="dash-btn-primary">
            {published ? 'Mettre à jour' : 'Publier'}
          </button>
        </div>
      </header>

      {error && <div className="editor-error">{error}</div>}
      {saved && <div className="editor-saved">✓ Enregistré</div>}
      {generatingMeta && <div className="editor-generating"><span className="editor-saving">◆</span>{' '}DeepSeek génère le sommaire et les tags…</div>}

      <div className="editor-layout">
        <div>
          <div className="editor-tabs">
            {(['fr', 'en'] as const).map(lang => (
              <button key={lang} onClick={() => setActiveTab(lang)} className={`editor-tab${activeTab === lang ? ' active' : ''}`}>{lang.toUpperCase()}</button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={togglePreview}
              disabled={loadingPreview}
              className={`editor-preview-btn${preview ? ' active' : ''}`}
            >
              {loadingPreview ? '…' : preview ? '← Éditer' : 'Aperçu →'}
            </button>
          </div>

          <input value={activeTab === 'fr' ? titleFr : titleEn} onChange={e => activeTab === 'fr' ? setTitleFr(e.target.value) : setTitleEn(e.target.value)} placeholder={activeTab === 'fr' ? 'Titre en français…' : 'Title in English…'} className="editor-input editor-title" />
          <input value={activeTab === 'fr' ? dekFr : dekEn} onChange={e => activeTab === 'fr' ? setDekFr(e.target.value) : setDekEn(e.target.value)} placeholder={activeTab === 'fr' ? 'Accroche (dek)…' : 'Standfirst (dek)…'} className="editor-input editor-dek" />

          {/* Textareas natifs — toujours dans le DOM, jamais contrôlés par React */}
          <NativeTextarea
            defaultValue={initBodyFr.current}
            placeholder={`Écris en Markdown…\n\n## Titre de section\n\nParagraphe de texte.\n\n> Citation\n\n\`\`\`js\nconst x = 1\n\`\`\``}
            visible={!preview && activeTab === 'fr'}
            textareaRef={textareaFr}
          />
          <NativeTextarea
            defaultValue={initBodyEn.current}
            placeholder={`Write in Markdown…\n\n## Section title\n\nParagraph text.\n\n> Quote\n\n\`\`\`js\nconst x = 1\n\`\`\``}
            visible={!preview && activeTab === 'en'}
            textareaRef={textareaEn}
          />

          {/* Preview — affiché par-dessus */}
          {preview && (
            <div className="article-body editor-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </div>

        <aside>
          <div className="editor-meta-panel">
            <div className="editor-meta-title">Métadonnées</div>
            <label className="editor-label">Slug</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="editor-input-sm" placeholder="mon-article" />
            <label className="editor-label">Numéro (issue)</label>
            <input type="number" value={issue} onChange={e => setIssue(+e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Temps de lecture (min)</label>
            <input type="number" value={readMin} onChange={e => setReadMin(+e.target.value)} className="editor-input-sm" />
            <div className="editor-checkboxes">
              <label className="editor-checkbox"><input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /><span>Article à la une</span></label>
              <label className="editor-checkbox"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /><span>Publié</span></label>
            </div>
          </div>

          <div className="editor-meta-panel editor-meta-panel--mt">
            <div className="editor-meta-section-head">
              <div className="editor-meta-title" style={{ margin: 0 }}>Tags</div>
              <button onClick={handleRegenMeta} disabled={generatingMeta} className="editor-regen-btn">{generatingMeta ? <span className="editor-saving">◆</span> : '↺ IA'}</button>
            </div>
            <div className="editor-tags-list">
              {tagEntries.map((tag, i) => (
                <div key={i} className="editor-tag-row">
                  <input value={tag.nameFr} onChange={e => setTagEntries(t => t.map((x, j) => j === i ? { ...x, nameFr: e.target.value } : x))} placeholder="FR" className="editor-input-sm editor-tag-input" />
                  <input value={tag.nameEn} onChange={e => setTagEntries(t => t.map((x, j) => j === i ? { ...x, nameEn: e.target.value } : x))} placeholder="EN" className="editor-input-sm editor-tag-input" />
                  <button onClick={() => setTagEntries(t => t.filter((_, j) => j !== i))} className="editor-remove-btn">×</button>
                </div>
              ))}
            </div>
            <div className="editor-tag-add">
              <input value={newTagFr} onChange={e => setNewTagFr(e.target.value)} placeholder="FR" className="editor-input-sm editor-tag-input" onKeyDown={e => { if (e.key === 'Enter' && newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }} />
              <input value={newTagEn} onChange={e => setNewTagEn(e.target.value)} placeholder="EN" className="editor-input-sm editor-tag-input" onKeyDown={e => { if (e.key === 'Enter' && newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }} />
              <button onClick={() => { if (newTagFr) { setTagEntries(t => [...t, { nameFr: newTagFr, nameEn: newTagEn }]); setNewTagFr(''); setNewTagEn('') } }} className="editor-add-btn">+</button>
            </div>
          </div>

          <div className="editor-meta-panel editor-meta-panel--mt">
            <div className="editor-meta-section-head">
              <div className="editor-meta-title" style={{ margin: 0 }}>Sommaire (TOC)</div>
              <button onClick={handleRegenMeta} disabled={generatingMeta} className="editor-regen-btn">{generatingMeta ? <span className="editor-saving">◆</span> : '↺ IA'}</button>
            </div>
            {tocEntries.length === 0 && <p className="editor-toc-empty">Aucune entrée. Publie l'article ou clique sur ↺ IA.</p>}
            <div className="editor-toc-list">
              {tocEntries.map((item, i) => (
                <div key={i} className="editor-toc-row">
                  <div className="editor-toc-anchor">#{item.anchorId}</div>
                  <input value={item.labelFr} onChange={e => setTocEntries(t => t.map((x, j) => j === i ? { ...x, labelFr: e.target.value } : x))} placeholder="Label FR" className="editor-input-sm" />
                  <input value={item.labelEn} onChange={e => setTocEntries(t => t.map((x, j) => j === i ? { ...x, labelEn: e.target.value } : x))} placeholder="Label EN" className="editor-input-sm" />
                  <button onClick={() => setTocEntries(t => t.filter((_, j) => j !== i))} className="editor-remove-btn">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setTocEntries(t => [...t, { anchorId: '', labelFr: '', labelEn: '', sortOrder: t.length }])} className="editor-add-toc-btn">+ Ajouter une entrée</button>
          </div>

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
