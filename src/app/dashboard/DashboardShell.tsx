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
    { href: '/dashboard/projects', label: 'Projets', icon: '◆' },
    { href: '/dashboard/comments', label: 'Commentaires', icon: '◇' },
    { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙' },
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
    </div>
  )
}
