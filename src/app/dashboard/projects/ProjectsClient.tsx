'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfirm } from '@/hooks/useConfirm'
import type { Project } from '@/db/schema'

const STATUS_COLORS = { live: '#3FA264', new: 'var(--accent)', wip: '#D9A94C' }
const EMPTY: Omit<Project, 'id'> = {
  slug: '', name: '', year: String(new Date().getFullYear()),
  url: '', kindFr: '', kindEn: '', descFr: '', descEn: '',
  tags: [], status: 'live', sortOrder: 0,
}

export function ProjectsClient({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(initial)
  const [editing, setEditing] = useState<Project | Partial<Project> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const { confirm, ConfirmDialog } = useConfirm()

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true) }
  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false) }
  const close = () => { setEditing(null); setError('') }

  const setF = (k: keyof typeof EMPTY, v: unknown) =>
    setEditing(e => e ? { ...e, [k]: v } : e)

  const save = async () => {
    if (!editing) return
    setSaving(true); setError('')
    try {
      const res = await fetch(
        isNew ? '/api/dashboard/projects' : `/api/dashboard/projects/${(editing as Project).id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        }
      )
      if (!res.ok) throw new Error(await res.text())
      close()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: number, name: string) => {
    const ok = await confirm({
      title: 'Supprimer le projet',
      message: `Supprimer « ${name} » ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      danger: true,
    })
    if (!ok) return
    await fetch(`/api/dashboard/projects/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Dashboard</p>
          <h1 className="editor-heading">Projets</h1>
        </div>
        <button onClick={openNew} className="dash-btn-primary">+ Nouveau projet</button>
      </header>

      {ConfirmDialog}

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div className="proj-dash-header">
          <span>Nom</span><span>Statut</span><span>Année</span><span>URL</span><span></span>
        </div>
        {projects.map(p => (
          <div key={p.id} className="proj-dash-row">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>{p.slug}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[p.status], display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: STATUS_COLORS[p.status] }}>{p.status}</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>{p.year}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
              {p.url && p.url !== '#' ? <a href={p.url} target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'none' }}>↗</a> : '—'}
            </span>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => openEdit(p)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Éditer</button>
              <button onClick={() => del(p.id, p.name)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer' }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Modal édition ─── */}
      {editing && (
        <div className="proj-modal-overlay" onClick={close}>
          <div className="proj-modal" onClick={e => e.stopPropagation()}>
            <div className="proj-modal-head">
              <h2 className="editor-heading" style={{ fontSize: 22 }}>{isNew ? 'Nouveau projet' : 'Éditer le projet'}</h2>
              <button onClick={close} style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            {error && <div className="editor-error">{error}</div>}

            <div className="proj-modal-body">
              <div className="proj-modal-grid">
                {/* Colonne gauche */}
                <div>
                  <label className="editor-label">Nom</label>
                  <input value={editing.name ?? ''} onChange={e => setF('name', e.target.value)} className="editor-input-sm" placeholder="MonProjet" />

                  <label className="editor-label">Slug</label>
                  <input value={editing.slug ?? ''} onChange={e => setF('slug', e.target.value)} className="editor-input-sm" placeholder="mon-projet" />

                  <label className="editor-label">Année</label>
                  <input value={editing.year ?? ''} onChange={e => setF('year', e.target.value)} className="editor-input-sm" placeholder="2024" />

                  <label className="editor-label">URL</label>
                  <input value={editing.url ?? ''} onChange={e => setF('url', e.target.value)} className="editor-input-sm" placeholder="https://…" />

                  <label className="editor-label">Statut</label>
                  <select value={editing.status ?? 'live'} onChange={e => setF('status', e.target.value)} className="editor-input-sm">
                    <option value="live">Live</option>
                    <option value="new">Nouveau</option>
                    <option value="wip">En cours</option>
                  </select>

                  <label className="editor-label">Ordre d'affichage</label>
                  <input type="number" value={editing.sortOrder ?? 0} onChange={e => setF('sortOrder', +e.target.value)} className="editor-input-sm" />
                </div>

                {/* Colonne droite */}
                <div>
                  <label className="editor-label">Type FR</label>
                  <input value={editing.kindFr ?? ''} onChange={e => setF('kindFr', e.target.value)} className="editor-input-sm" placeholder="Paquet npm" />

                  <label className="editor-label">Type EN</label>
                  <input value={editing.kindEn ?? ''} onChange={e => setF('kindEn', e.target.value)} className="editor-input-sm" placeholder="npm package" />

                  <label className="editor-label">Description FR</label>
                  <textarea value={editing.descFr ?? ''} onChange={e => setF('descFr', e.target.value)} className="settings-textarea" rows={3} />

                  <label className="editor-label">Description EN</label>
                  <textarea value={editing.descEn ?? ''} onChange={e => setF('descEn', e.target.value)} className="settings-textarea" rows={3} />

                  <label className="editor-label">Tags (séparés par virgule)</label>
                  <input
                    value={(editing.tags ?? []).join(', ')}
                    onChange={e => setF('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="editor-input-sm"
                    placeholder="nextjs, typescript, open-source"
                  />
                </div>
              </div>
            </div>

            <div className="proj-modal-foot">
              <button onClick={close} className="dash-btn-ghost">Annuler</button>
              <button onClick={save} disabled={saving} className="dash-btn-primary">
                {saving ? '…' : isNew ? 'Créer' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .proj-dash-header {
          display: grid; grid-template-columns: 1fr 100px 80px 60px 120px;
          gap: 16px; padding: 8px 12px;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--ink-mute); border-bottom: 1px solid var(--rule);
        }
        .proj-dash-row {
          display: grid; grid-template-columns: 1fr 100px 80px 60px 120px;
          gap: 16px; align-items: center;
          padding: 14px 12px; border-bottom: 1px solid var(--rule-soft);
          transition: background .15s;
        }
        .proj-dash-row:hover { background: var(--bg-tint); }
        .proj-modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: color-mix(in srgb, var(--ink) 40%, transparent);
          backdrop-filter: blur(4px);
          display: grid; place-items: center;
          padding: 24px;
        }
        .proj-modal {
          width: min(860px, 100%);
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 8px;
          box-shadow: 0 24px 60px rgba(0,0,0,.2);
          display: flex; flex-direction: column;
          max-height: 90vh;
          animation: ai-pop .2s ease;
        }
        .proj-modal-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--rule);
        }
        .proj-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
        .proj-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .proj-modal-foot {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 16px 24px;
          border-top: 1px solid var(--rule);
          background: var(--bg-tint);
        }
        .settings-textarea {
          width: 100%; padding: 8px 10px;
          border: 1px solid var(--rule); border-radius: 3px;
          background: var(--surface); font-family: var(--font-read);
          font-size: 14px; color: var(--ink); outline: none;
          resize: vertical; transition: border-color .15s;
          box-sizing: border-box; line-height: 1.6;
        }
        .settings-textarea:focus { border-color: var(--accent); }
        .settings-grid { max-width: 680px; }
        .settings-hint {
          font-family: var(--font-read); font-style: italic;
          font-size: 14px; color: var(--ink-mute); margin-bottom: 20px;
        }
        .settings-link-row {
          display: grid; grid-template-columns: 1fr 2fr 28px;
          gap: 8px; align-items: center;
        }
      `}</style>
    </div>
  )
}
