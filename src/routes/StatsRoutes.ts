import express from 'express'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import ProjectsService, { projectDetail } from '../services/ProjectService'
import OwnerService, { owner } from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'

class StatsRoutes {
  router: express.Router
  projectService: ProjectsService
  ownerService: OwnerService
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (pgClient: Client) {
    this.router = express.Router()
    this.projectService = new ProjectsService(pgClient)
    this.ownerService = new OwnerService(pgClient)

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (!req.query.page || req.query.page === '') req.query.page = '0'
        res.render('stats', await this.statsView(<string>req.query.page))
      }
    })
  }

  async statsView (page: string): Promise<{
    title: string;
    sidebar: string;
    statsActive: boolean;
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
    const projects = groupBy((await this.projectService.getProjectsDetail()), 'id')
    const grouped = Object.keys(projects).map(a => {
      const g = {
        id: parseInt(a),
        times: projects[a],
        name: projects[a][0].name,
        description: projects[a][0].description,
        hours: projects[a][0].project_hours
      }
      g.times = g.times.map((b: projectDetail) => {
        b.color = this.colors[b.time_id % this.colors.length]
        return b
      })
      return g
    })
    return {
      title: 'Timetracker - Stats',
      sidebar: new sidebarComponent('/stats').render(),
      statsActive: true,
      owners: await this.ownerService.getOwners(),
      projects: grouped,
      page: page
    }
  }
}
export default StatsRoutes
