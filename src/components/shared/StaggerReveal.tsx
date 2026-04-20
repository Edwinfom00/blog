'use client'

import { useRef, useEffect, useState } from 'react'

interface StaggerRevealProps {
  children: React.ReactNode
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: React.CSSProperties
}

/**
 * Révèle son enfant avec un fadeUp quand il entre dans le viewport.
 * Fonctionne correctement avec le SSR : l'élément commence invisible
 * et s'anime après montage + intersection.
 */
export function StaggerReveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  style,
}: StaggerRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Vérification reduced-motion */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setVisible(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Component = Tag as React.ElementType

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: visible
          ? `opacity .35s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .35s cubic-bezier(.4,0,.2,1) ${delay}ms`
          : 'none',
      }}
    >
      {children}
    </Component>
  )
}
