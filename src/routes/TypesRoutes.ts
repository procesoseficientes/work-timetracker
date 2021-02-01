import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import TypeService from '../services/TypeService'
import { hasAccess } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'
import { RoleService } from '../services/RoleService'
import createHttpError from 'http-errors'

export function TypesRoutes (pgClient: Client): Router {
  const router = Router()
  const typeService = new TypeService(pgClient)
  const roleService = new RoleService(pgClient)

  router.get('/', hasAccess('read', roleService), async (req, res, next) => {
    roleService.getAccessByRouteAndRole('/types', req.session?.roleId)
    .then(async access => {
      res.render('types', {
        title: 'Timetracker - Types',
        sidebar: new sidebarComponent(
          '/types',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        table: new tableComponent(
          toTableArray(await typeService.getTypes()), 
          access.update, 
          access.delete,
          './types'
        ).render()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.post('/', hasAccess('create', roleService), validateBody(body => body.type != null), async (req, res, next) => {
    typeService.createType(req.body.type)
    .then(data => {
      console.log(data)
      res.status(201).redirect('/types')
    })
    .catch(err => next(createHttpError(500, err.message)))
  })

  router.get('/api', hasAccess('read', roleService), async (_req, res, next) => {
    typeService.getTypes()
    .then(data => res.status(200).send(data))
    .catch(err => next(createHttpError(500, err.message)))
  })

  router.put('/api/:id/toggle', hasAccess('update', roleService), (req, res) => {
    typeService.toggleState(parseInt(req.params.id)).then(data => {
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
