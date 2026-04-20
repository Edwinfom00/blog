import { Masthead } from '@/components/home/Masthead'
import { HeroSection } from '@/components/home/HeroSection'
import { LatestSection } from '@/components/home/LatestSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { Rule } from '@/components/shared/Rule'
import { getFeaturedArticles, getLatestArticles, getFeaturedProjects } from '@/db/queries'

export default async function HomePage() {
  const [featured, latest, projects] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(4),
    getFeaturedProjects(6),
  ])

  const heroArticle = featured[0] ?? latest[0]

  return (
    <>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
        <Masthead latestIssue={heroArticle?.issue ?? latest[0]?.issue} />
      </div>

      {heroArticle && <HeroSection article={heroArticle} />}

      <Rule />

      <LatestSection articles={latest} />

      <Rule ornament />

      <ProjectsSection projects={projects} />
    </>
  )
}
