import express from 'express'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'
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

  async statsView (page: string) {
    const projects = groupBy((await this.projectService.getProjectsDetail()).rows, 'id')
    const grouped = Object.keys(projects).map(a => {
      const g = {
        id: parseInt(a),
        times: projects[a],
        name: projects[a][0].name,
        description: projects[a][0].description,
        hours: projects[a][0].project_hours
      }
      g.times = g.times.map((b: any) => {
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
