import express from 'express'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService, { owner } from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'

class ProjectsRoutes {
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
        res.render('projects', await this.projectsView())
      }
    })

    this.router.post('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (
          req.body.owner &&
          req.body.name && 
          req.body.description && 
          req.body.budget
        ) {
          try {
            this.projectService.createProject(req.body.owner, req.body.name, req.body.description,req.body.budget)
            res.status(201).redirect('/projects')
          } catch (error) {
            console.error(error)
            res.status(500).redirect('/projects')
          }
        } else {
          console.error('Insufficient parameters for request')
          res.status(401).redirect('/projects')
        }
      }
    })
  

    this.router.get('/api', async (req, res) => {
      if (!req.session.user) {
        res.status(401).send('Unathorized')
      } else {
        if (req.query.ownerId != null) {
          const id: number = isNaN(parseInt(<string>req.query.ownerId)) ? 1 : parseInt(<string>req.query.ownerId)
          res.send(await this.projectService.getProjectsByOwner(id))
        } else {
          res.send(await this.projectService.getProjects())
        }
      }
    })
  }

  async projectsView (): Promise<{
    title: string;
    sidebar: string;
    detailActive: boolean;
    table: string;
    owners: owner[];
  }> {
    return {
      title: 'Timetracker - Projects',
      sidebar: new sidebarComponent('/projects').render(),
      detailActive: true,
      table: new tableComponent(toTableArray(await this.projectService.getProjects())).render(),
      owners: await this.ownerService.getOwners()
    }
  }
}
export default ProjectsRoutes
