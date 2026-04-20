import { getAboutSettings, getSiteConfig } from '@/lib/settings'
import { SettingsClient } from './SettingsClient'

export default async function DashboardSettingsPage() {
  const [about, config] = await Promise.all([
    getAboutSettings(),
    getSiteConfig(),
  ])

  return <SettingsClient about={about} config={config} />
}
