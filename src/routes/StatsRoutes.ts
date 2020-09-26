import express from 'express'
import { groupBy } from '../utils/json'
import createError from 'http-errors'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'

class StatsRoutes {
  router: express.Router
  projectService: ProjectsService
  ownerService: OwnerService
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (pgClient: Client) {
    this.router = express.Router()
    this.projectService = new ProjectsService(pgClient)
    this.ownerService = new OwnerService(pgClient)

    this.router.get('/', async (req, res, next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (!req.query.page || req.query.page === '') req.query.page = '0'
        res.render('stats', await this.projectsView(<string>req.query.page))
      }
    })

    this.router.post('/', async (req, res, next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        try {
          await this.projectService.createProject(
            req.body.owner,
            req.body.name,
            req.body.description,
            req.body.budget
          )
          res.status(201).redirect('/stats')
        } catch (error) {
          console.error(error)
          next(createError(500))
        }
      }
    })

    this.router.get('/json', async (req, res, next) => {
      res.send(await this.projectService.getProjectsByOwner(parseInt(<string>req.query.id)))
    })
  }

  async projectsView (page: string) {
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
      projectsActive: true,
      owners: await this.ownerService.getOwners(),
      projects: grouped,
      page: page
    }
  }
}
export default StatsRoutes
