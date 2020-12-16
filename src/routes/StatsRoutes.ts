import { Router } from 'express'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import ProjectsService, { projectDetail } from '../services/ProjectService'
import OwnerService, { owner } from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'

export function StatsRoutes (pgClient: Client): Router {
  const router = Router()
  const projectService = new ProjectsService(pgClient)
  const ownerService = new OwnerService(pgClient)
  const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (!req.query.page || req.query.page === '') req.query.page = '0'
      res.render('stats', await statsView(<string>req.query.page))
    }
  })

  async function statsView (page: string): Promise<{
    title: string;
    sidebar: string;
    owners: owner[];
    projects: {
        id: number;
        times: projectDetail;
        name: string;
        description: string;
        hours: number;
    }[];
    page: string;
  }> {
    const projects = groupBy((await projectService.getProjectsDetail()), 'id')
    const grouped = Object.keys(projects).map(a => {
      const g = {
        id: parseInt(a),
        times: projects[a],
        name: projects[a][0].name,
        description: projects[a][0].description,
        hours: projects[a][0].project_hours
      }
      g.times = g.times.map((b: projectDetail) => {
        b.color = colors[b.time_id % colors.length]
        return b
      })
      return g
    })
    return {
      title: 'Timetracker - Stats',
      sidebar: new sidebarComponent('/stats').render(),
      owners: await ownerService.getOwners(),
      projects: grouped,
      page: page
    }
  }

  return router
}