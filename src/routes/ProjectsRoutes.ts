import { Router } from 'express'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { tableComponent } from '../components/table/table'
import { Parser } from 'json2csv'
import toTableArray from '../utils/tableArray'
import { hasAccess } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'
import { RoleService } from '../services/RoleService'
import createHttpError from 'http-errors'

export function ProjectsRoutes(pgClient: Client): Router {
  const router = Router()
  const projectService = new ProjectsService(pgClient)
  const roleService = new RoleService(pgClient)
  const ownerService = new OwnerService(pgClient)
  
  router.get('/', hasAccess('read', roleService), (req, res, next) => {
    roleService.getAccessByRouteAndRole('/projects', req.session?.roleId)
    .then(async access => {
      res.render('projects', {
        title: 'Timetracker - Projects',
        sidebar: new sidebarComponent(
          '/projects',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        table: new tableComponent(
          toTableArray(await projectService.getProjects()), 
          access.update, 
          access.delete,
          './projects'
        ).render(),
        owners: await ownerService.getOwners()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })
    
  router.post(
    '/', 
    hasAccess('create', roleService), 
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
  
  router.get('/api', hasAccess('read', roleService), async (req, res) => {
    if (req.query.ownerId != null) {
      const id: number = isNaN(parseInt(<string>req.query.ownerId)) ? 1 : parseInt(<string>req.query.ownerId)
      res.send(await projectService.getProjectsByOwner(id))
    } else {
      res.send(await projectService.getProjects())
    }
  })
  
  router.get('/excel', hasAccess('read', roleService), async (_req, res, next) => {
    projectService.getProjects().then(data =>{ 
      const parser = new Parser()
      const csv = parser.parse(data)
      
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="projects.csv"`,
        'Content-Type': 'text/csv',
      })
      res.end(csv)
    }).catch(err => next(createHttpError(500, err.message)))
  })

  router.put('/api/:id/toggle', hasAccess('update', roleService), (req, res) => {
    projectService.toggleState(parseInt(req.params.id)).then(data => {
      res.send({
        status: 200,
        data: data
      })
    }).catch(err => {
      console.error(err)
      res.status(500).send({
        status: 500,
        message: err.message
      })
    })
  })

  return router
}
