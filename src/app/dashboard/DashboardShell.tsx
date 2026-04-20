'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface User { name: string; email: string }

export function DashboardShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/login')
  }

  const nav = [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: '◈' },
    { href: '/dashboard/articles', label: 'Articles', icon: '✦' },
    { href: '/dashboard/comments', label: 'Commentaires', icon: '◆' },
  ]

  return (
    <div className="dash-root">
      {/* ─── Sidebar ─── */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-mark">EF</span>
          <div>
            <div className="dash-brand-name">Edwin Fom</div>
            <div className="dash-brand-sub">Dashboard</div>
          </div>
        </div>

        <nav className="dash-nav">
          {nav.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`dash-nav-item${pathname === href ? ' active' : ''}`}
            >
              <span className="dash-nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-foot">
          <div className="dash-user">
            <div className="dash-user-name">{user.name || user.email}</div>
            <div className="dash-user-email">{user.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="dash-signout"
          >
            {signingOut ? '…' : 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="dash-main">
        {children}
      </main>

      <style>{`
        .dash-root {
          display: grid;
          grid-template-columns: 220px 1fr;
          min-height: 100vh;
          background: var(--bg);
        }
        .dash-sidebar {
          border-right: 1px solid var(--rule);
          background: var(--bg-tint);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .dash-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px 24px;
          border-bottom: 1px solid var(--rule);
          margin-bottom: 16px;
        }
        .dash-brand-mark {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--ink);
          color: var(--bg);
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-brand-name {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 15px;
          color: var(--ink);
          line-height: 1.1;
        }
        .dash-brand-sub {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--ink-mute);
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .dash-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 12px;
        }
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 13px;
          color: var(--ink-soft);
          text-decoration: none;
          transition: background .15s, color .15s;
        }
        .dash-nav-item:hover { background: var(--rule-soft); color: var(--ink); }
        .dash-nav-item.active { background: var(--ink); color: var(--bg); }
        .dash-nav-icon {
          font-size: 11px;
          color: var(--accent);
          width: 16px;
          text-align: center;
        }
        .dash-nav-item.active .dash-nav-icon { color: var(--bg); opacity: .7; }
        .dash-sidebar-foot {
          padding: 16px 20px 0;
          border-top: 1px solid var(--rule);
          margin-top: auto;
        }
        .dash-user { margin-bottom: 12px; }
        .dash-user-name {
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
        }
        .dash-user-email {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--ink-mute);
          margin-top: 2px;
        }
        .dash-signout {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: .06em;
          color: var(--ink-mute);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color .15s;
        }
        .dash-signout:hover { color: var(--accent); }
        .dash-main {
          padding: 40px 48px;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .dash-root { grid-template-columns: 1fr; }
          .dash-sidebar { position: static; height: auto; }
          .dash-main { padding: 24px 20px; }
        }
      `}</style>
    </div>
  )
}
