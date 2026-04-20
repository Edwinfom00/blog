'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useConfirm } from '@/hooks/useConfirm'
import type { Comment } from '@/db/schema'

interface Row {
  comment: Comment
  articleTitleFr: string | null
  articleSlug: string | null
}

type Filter = 'all' | 'pending' | 'approved'

export function CommentModerationClient({ rows }: { rows: Row[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<Filter>('pending')
  const [acting, setActing] = useState<number | null>(null)

  const filtered = rows.filter(r => {
    if (filter === 'pending') return !r.comment.approved
    if (filter === 'approved') return r.comment.approved
    return true
  })

  const pending = rows.filter(r => !r.comment.approved).length
  const approved = rows.filter(r => r.comment.approved).length

  const { confirm, ConfirmDialog } = useConfirm()

  const act = async (id: number, action: 'approve' | 'reject', authorName?: string) => {
    if (action === 'reject') {
      const ok = await confirm({
        title: 'Supprimer le commentaire',
        message: `Supprimer le commentaire de ${authorName ?? 'cet utilisateur'} ? Cette action est irréversible.`,
        confirmLabel: 'Supprimer',
        danger: true,
      })
      if (!ok) return
    }
    setActing(id)
    try {
      await fetch(`/api/dashboard/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      startTransition(() => router.refresh())
    } finally {
      setActing(null)
    }
  }

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'pending', label: 'En attente', count: pending },
    { key: 'approved', label: 'Approuvés', count: approved },
    { key: 'all', label: 'Tous', count: rows.length },
  ]

  return (
    <div>
      {ConfirmDialog}
      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              border: '1px solid var(--rule)',
              borderRadius: 3,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: filter === key ? 'var(--bg)' : 'var(--ink-soft)',
              background: filter === key ? 'var(--ink)' : 'transparent',
              borderColor: filter === key ? 'var(--ink)' : 'var(--rule)',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {label}
            <span style={{
              padding: '1px 5px',
              borderRadius: 999,
              background: filter === key ? 'rgba(255,255,255,.15)' : 'var(--bg-tint)',
              fontSize: 10,
            }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', color: 'var(--ink-mute)', padding: '40px 0' }}>
          Aucun commentaire dans cette catégorie.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map(({ comment, articleTitleFr, articleSlug }) => (
            <div
              key={comment.id}
              style={{
                padding: '20px 0',
                borderBottom: '1px solid var(--rule-soft)',
                opacity: acting === comment.id ? .5 : 1,
                transition: 'opacity .2s',
              }}
            >
              {/* Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                    {comment.authorName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
                    {comment.authorEmail}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    padding: '1px 6px',
                    borderRadius: 3,
                    background: comment.approved ? '#3FA26420' : '#D9A94C20',
                    color: comment.approved ? '#3FA264' : '#D9A94C',
                    border: `1px solid ${comment.approved ? '#3FA26440' : '#D9A94C40'}`,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                  }}>
                    {comment.approved ? 'Approuvé' : 'En attente'}
                  </span>
                </div>
                <time style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
                  {new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>

              {/* Article */}
              {articleTitleFr && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>
                  ✦ {articleTitleFr}
                </div>
              )}

              {/* Contenu */}
              <p style={{ fontFamily: 'var(--font-read)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 14px', maxWidth: 680 }}>
                {comment.content}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {!comment.approved && (
                  <button
                    onClick={() => act(comment.id, 'approve')}
                    disabled={acting === comment.id}
                    style={{
                      padding: '6px 14px',
                      background: '#3FA26420',
                      color: '#3FA264',
                      border: '1px solid #3FA26440',
                      borderRadius: 3,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'background .15s',
                    }}
                    className="mod-btn-approve"
                  >
                    ✓ Approuver
                  </button>
                )}
                <button
                  onClick={() => act(comment.id, 'reject', comment.authorName)}
                  disabled={acting === comment.id}
                  style={{
                    padding: '6px 14px',
                    background: '#C4453A10',
                    color: '#C4453A',
                    border: '1px solid #C4453A30',
                    borderRadius: 3,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  className="mod-btn-reject"
                >
                  ✕ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mod-btn-approve:hover:not(:disabled) { background: #3FA26430 !important; }
        .mod-btn-reject:hover:not(:disabled) { background: #C4453A20 !important; }
      `}</style>
    </div>
  )
}
