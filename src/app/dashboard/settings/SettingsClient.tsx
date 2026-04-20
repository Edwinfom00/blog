'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AboutSettings, SiteConfig } from '@/lib/settings'

interface Props {
  about: AboutSettings
  config: SiteConfig
}

type Tab = 'about' | 'site' | 'links' | 'stack'

export function SettingsClient({ about: initialAbout, config: initialConfig }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('about')
  const [about, setAbout] = useState(initialAbout)
  const [config, setConfig] = useState(initialConfig)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setA = (k: keyof AboutSettings, v: unknown) => setAbout(a => ({ ...a, [k]: v }))
  const setC = (k: keyof SiteConfig, v: string) => setConfig(c => ({ ...c, [k]: v }))

  const save = async () => {
    setSaving(true); setSaved(false); setError('')
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about, config }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'about', label: 'À propos' },
    { key: 'site', label: 'Site' },
    { key: 'links', label: 'Liens' },
    { key: 'stack', label: 'Stack' },
  ]

  return (
    <div>
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Dashboard</p>
          <h1 className="editor-heading">Paramètres</h1>
        </div>
        <button onClick={save} disabled={saving} className="dash-btn-primary">
          {saving ? '…' : 'Enregistrer'}
        </button>
      </header>

      {error && <div className="editor-error">{error}</div>}
      {saved && <div className="editor-saved">✓ Enregistré</div>}

      {/* Tabs */}
      <div className="editor-tabs" style={{ marginBottom: 32 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`editor-tab${tab === t.key ? ' active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── À propos ─── */}
      {tab === 'about' && (
        <div className="settings-grid">
          <div>
            <label className="editor-label">Tagline FR</label>
            <input value={about.taglineFr} onChange={e => setA('taglineFr', e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Tagline EN</label>
            <input value={about.taglineEn} onChange={e => setA('taglineEn', e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Bio FR</label>
            <textarea value={about.bioFr} onChange={e => setA('bioFr', e.target.value)} className="settings-textarea" rows={10} />
            <label className="editor-label">Bio EN</label>
            <textarea value={about.bioEn} onChange={e => setA('bioEn', e.target.value)} className="settings-textarea" rows={10} />
          </div>
        </div>
      )}

      {/* ─── Site ─── */}
      {tab === 'site' && (
        <div className="settings-grid">
          <div>
            <label className="editor-label">Colophon FR (footer)</label>
            <input value={config.colophonFr} onChange={e => setC('colophonFr', e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Colophon EN (footer)</label>
            <input value={config.colophonEn} onChange={e => setC('colophonEn', e.target.value)} className="editor-input-sm" />
            <label className="editor-label">Localisation (masthead)</label>
            <input value={config.location} onChange={e => setC('location', e.target.value)} className="editor-input-sm" placeholder="Cameroun" />
            <label className="editor-label">Label journal FR (masthead)</label>
            <input value={config.journalLabelFr} onChange={e => setC('journalLabelFr', e.target.value)} className="editor-input-sm" placeholder="Journal hebdomadaire" />
            <label className="editor-label">Label journal EN (masthead)</label>
            <input value={config.journalLabelEn} onChange={e => setC('journalLabelEn', e.target.value)} className="editor-input-sm" placeholder="Weekly journal" />
          </div>
        </div>
      )}

      {/* ─── Liens ─── */}
      {tab === 'links' && (
        <div>
          <p className="settings-hint">Ces liens apparaissent sur la page À propos et dans le footer.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {about.links.map((link, i) => (
              <div key={i} className="settings-link-row">
                <input
                  value={link.label}
                  onChange={e => setA('links', about.links.map((l, j) => j === i ? { ...l, label: e.target.value } : l))}
                  placeholder="Label"
                  className="editor-input-sm"
                />
                <input
                  value={link.href}
                  onChange={e => setA('links', about.links.map((l, j) => j === i ? { ...l, href: e.target.value } : l))}
                  placeholder="https://…"
                  className="editor-input-sm"
                />
                <button onClick={() => setA('links', about.links.filter((_, j) => j !== i))} className="editor-remove-btn">×</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setA('links', [...about.links, { label: '', href: '' }])}
            className="editor-add-toc-btn"
          >
            + Ajouter un lien
          </button>
        </div>
      )}

      {/* ─── Stack ─── */}
      {tab === 'stack' && (
        <div>
          <p className="settings-hint">Technologies affichées sur la page À propos.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {about.stack.map((item, i) => (
              <div key={i} className="settings-link-row">
                <input
                  value={item}
                  onChange={e => setA('stack', about.stack.map((s, j) => j === i ? e.target.value : s))}
                  className="editor-input-sm"
                />
                <button onClick={() => setA('stack', about.stack.filter((_, j) => j !== i))} className="editor-remove-btn">×</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setA('stack', [...about.stack, ''])}
            className="editor-add-toc-btn"
          >
            + Ajouter
          </button>
        </div>
      )}
    </div>
  )
}
