import { getAllProjects } from '@/db/queries'
import { ProjectsClient } from './ProjectsClient'

export default async function DashboardProjectsPage() {
  const projects = await getAllProjects()
  return <ProjectsClient projects={projects} />
}
