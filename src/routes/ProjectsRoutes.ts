import express from 'express'
import { groupBy } from '../utils/json'
import createError from 'http-errors'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'

class ProjectsRoutes {
  router: express.Router
  projectService: ProjectsService
  ownerService: OwnerService
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (pgClient: Client) {
    this.router = express.Router()
    this.projectService = new ProjectsService(pgClient)
    this.ownerService = new OwnerService(pgClient)

    this.router.get('/api', async (req, res, next) => {
      res.send(await this.projectService.getProjects(<string>req.query.id))
    })
  }
}
export default ProjectsRoutes
