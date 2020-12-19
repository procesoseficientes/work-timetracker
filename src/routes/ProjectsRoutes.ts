import { Router } from 'express'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { tableComponent } from '../components/table/table'
import { Parser } from 'json2csv'
import toTableArray from '../utils/tableArray'
import { authenticated } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'

export function ProjectsRoutes(pgClient: Client): Router {
  const router = Router()
  const projectService = new ProjectsService(pgClient)
  const ownerService = new OwnerService(pgClient)
  
  router.get('/', authenticated, async (_req, res) => {
    res.render('projects', {
      title: 'Timetracker - Projects',
      sidebar: new sidebarComponent('/projects').render(),
      table: new tableComponent(
        toTableArray(await projectService.getProjects()), 
        true, 
        false,
        './projects'
      ).render(),
      owners: await ownerService.getOwners()
    })
  })
    
  router.post(
    '/', 
    authenticated, 
    validateBody(body => (
      body.owner != null &&
      body.name != null && 
      body.description != null && 
      body.budget != null
    )),
    async (req, res) => {
      try {
        projectService.createProject(req.body.owner, req.body.name, req.body.description,req.body.budget)
        res.status(201).redirect('/projects')
      } catch (error) {
        console.error(error)
        res.status(500).redirect('/projects')
      }
    }
  )
  
  router.get('/api', authenticated, async (req, res) => {
    if (req.query.ownerId != null) {
      const id: number = isNaN(parseInt(<string>req.query.ownerId)) ? 1 : parseInt(<string>req.query.ownerId)
      res.send(await projectService.getProjectsByOwner(id))
    } else {
      res.send(await projectService.getProjects())
    }
  })
  
  router.get('/excel', async (_req, res, next) => {
    projectService.getProjects().then(data =>{ 
      const parser = new Parser()
      const csv = parser.parse(data)
      
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="projects.csv"`,
        'Content-Type': 'text/csv',
      })
      res.end(csv)
    }).catch(err => next(err))
  })

  return router
}
