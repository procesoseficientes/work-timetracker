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

export function OwnersRoutes(pgClient: Client): Router {
  const router = Router()
  const ownerService = new OwnerService(pgClient)
  const roleService = new RoleService(pgClient)
  
  router.get('/', hasAccess('read', roleService), async (_req, res) => {
    res.render('owners', {
      title: 'Timetracker - Owners',
      sidebar: new sidebarComponent('/owners').render(),
      table: new tableComponent(
        toTableArray(await ownerService.getOwners()), 
        true, 
        false,
        './owners'
      ).render()
    })
  })
  
  router.post('/', hasAccess('create', roleService), validateBody(body => body.name != null), async (req, res, next) => {
    ownerService.createOwner(req.body.name)
    .then((data) => {
      console.log(data)
      res.status(201).redirect('/owners')
    })
    .catch(err => next(err))
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
      
    }).catch(err => next(err))
  })

  return router
}