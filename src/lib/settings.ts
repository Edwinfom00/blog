import { db } from '@/db/index'
import { siteSettings } from '@/db/schema'
import { eq } from 'drizzle-orm'

/* ─── Types des settings ─── */
export interface AboutSettings {
  bioFr: string
  bioEn: string
  taglineFr: string
  taglineEn: string
  links: { label: string; href: string }[]
  stack: string[]
}

export interface SiteConfig {
  colophonFr: string
  colophonEn: string
  location: string        // "Cameroun"
  journalLabelFr: string  // "Journal hebdomadaire"
  journalLabelEn: string  // "Weekly journal"
}

/* ─── Defaults ─── */
export const DEFAULT_ABOUT: AboutSettings = {
  bioFr: `Je suis Edwin Fom, développeur web basé au Cameroun. Je travaille principalement avec Next.js, TypeScript, et un goût prononcé pour les détails typographiques et les interfaces qui respirent.

Ce journal est l'endroit où je consigne ce que j'apprends, ce que je construis, et les questions qui me trottent dans la tête. Pas de newsletter, pas de notifications push. Un article quand j'ai quelque chose à dire — et seulement à ce moment-là.

J'ai commencé à écrire ici en 2021, d'abord pour moi, puis pour les autres. Les sujets varient : architecture front-end, performance, typographie web, outils de développement, et parfois des réflexions plus larges sur le métier.`,
  bioEn: `I'm Edwin Fom, a web developer based in Cameroon. I work primarily with Next.js, TypeScript, and a strong appreciation for typographic detail and interfaces that breathe.

This journal is where I write about what I learn, what I build, and the questions that keep me up. No newsletter, no push notifications. One article when I have something to say — and only then.

I started writing here in 2021, first for myself, then for others. Topics vary: front-end architecture, performance, web typography, developer tooling, and occasionally broader reflections on the craft.`,
  taglineFr: 'Développeur web, auteur de paquets open-source, et rédacteur de ce journal depuis 2021.',
  taglineEn: 'Web developer, open-source package author, and writer of this journal since 2021.',
  links: [
    { label: 'edwinfom.dev', href: 'https://www.edwinfom.dev/' },
    { label: 'packages.edwinfom.dev', href: 'https://packages.edwinfom.dev/' },
    { label: 'github.com/edwinfom', href: 'https://github.com/edwinfom' },
  ],
  stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM', 'PostgreSQL', 'Vercel'],
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  colophonFr: 'Composé avec Instrument Serif et Newsreader. Écrit au Cameroun.',
  colophonEn: 'Set in Instrument Serif & Newsreader. Written in Cameroon.',
  location: 'Cameroun',
  journalLabelFr: 'Journal hebdomadaire',
  journalLabelEn: 'Weekly journal',
}

/* ─── Helpers ─── */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.query.siteSettings.findFirst({ where: eq(siteSettings.key, key) })
    return row ? (row.value as T) : fallback
  } catch {
    return fallback
  }
}

export async function setSetting(key: string, value: unknown) {
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } })
}

export async function getAboutSettings(): Promise<AboutSettings> {
  return getSetting('about', DEFAULT_ABOUT)
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return getSetting('site_config', DEFAULT_SITE_CONFIG)
}
