import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import OwnerService from '../services/OwnerService'
import { Parser } from 'json2csv'
import { hasAccess } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'
import { RoleService } from '../services/RoleService'
import createHttpError from 'http-errors'

export function OwnersRoutes(pgClient: Client): Router {
  const router = Router()
  const ownerService = new OwnerService(pgClient)
  const roleService = new RoleService(pgClient)
  
  router.get('/', hasAccess('read', roleService), async (req, res, next) => {
    roleService.getAccessByRouteAndRole('/owners', req.session?.roleId)
    .then(async access => {
      res.render('owners', {
        title: 'Timetracker - Owners',
        sidebar: new sidebarComponent(
          '/owners',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        table: new tableComponent(
          toTableArray(await ownerService.getOwners()), 
          access.update, 
          access.delete,
          './owners'
        ).render()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })
  
  router.post('/', hasAccess('create', roleService), validateBody(body => body.name != null), async (req, res, next) => {
    ownerService.createOwner(req.body.name)
    .then((data) => {
      console.log(data)
      res.status(201).redirect('/owners')
    })
    .catch(err => next(createHttpError(500, err.message)))
  })
    
  router.get('/api', hasAccess('read', roleService), async (_req, res) => {
    res.status(200).send(await ownerService.getOwners())
  })
    
  router.get('/excel', hasAccess('read', roleService), async (_req, res, next) => {
    ownerService.getOwners()
    .then(data => {
      const parser = new Parser()
      const csv = parser.parse(data)
      
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="Owners.csv"`,
        'Content-Type': 'text/csv',
      })
      res.end(csv)
      
    }).catch(err => next(createHttpError(500, err.message)))
  })

  router.put('/api/:id/toggle', hasAccess('update', roleService), (req, res) => {
    ownerService.toggleState(parseInt(req.params.id)).then(data => {
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