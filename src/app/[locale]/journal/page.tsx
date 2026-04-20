import { getTranslations } from 'next-intl/server'
import { getAllArticles } from '@/db/queries'
import { JournalClient } from './JournalClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'journal' })
  return { title: t('title'), description: t('desc') }
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params
  const articles = await getAllArticles()
  return <JournalClient articles={articles} locale={locale} />
}
