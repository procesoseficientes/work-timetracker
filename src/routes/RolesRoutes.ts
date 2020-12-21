import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { RoleService } from '../services/RoleService'
import { hasAccess } from '../utils/auth'
import { validateBody, validateQuery } from '../utils/validateQuery'
import createHttpError from 'http-errors'

export function RolesRoutes (pgClient: Client): Router {
  const router = Router()
  const roleService = new RoleService(pgClient)

  router.get('/', hasAccess('read', roleService), async (req, res, next) => {
    roleService.getAccessByRouteAndRole('/roles', req.session?.roleId)
    .then(async access => {
      res.render('roles/roles', {
        title: 'Timetracker - Roles',
        sidebar: new sidebarComponent(
          '/roles',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        table: new tableComponent(
          toTableArray(await roleService.getRoles()), 
          access.update, 
          access.delete,
          './roles'
        ).render()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.post(
    '/', 
    hasAccess('create', roleService), 
    validateBody(body => (
      body.role != null &&
      body.color != null
    )),
    async (req, res, next) => {
      roleService.createRole(req.body.role, req.body.color)
      .then(data => {
        console.log(data)
        res.status(201).redirect('/roles')
      })
      .catch(err => next(createHttpError(500, err.message)))
    }
  )

  router.get('/api', hasAccess('read', roleService), async (_req, res, next) => {
    roleService.getRoles()
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => next(createHttpError(500, err.message)))
  })

  router.get('/:id', hasAccess('read', roleService), async (req, res) => {
    res.render('roles/role', {
      title: `Timetracker - Roles`,
      sidebar: new sidebarComponent(
        '/roles',
        await roleService.getAccessByRole(req.session?.roleId)
      ).render(),
      role: await roleService.getRole(parseInt(req.params.id)),
      table: new tableComponent(
        toTableArray(await roleService.getAccessByRole(parseInt(req.params.id))), 
        true, 
        true,
        `/roles/${req.params.id}`
      ).render()
    })
  })

  router.post(
    '/:id',
    hasAccess('create', roleService),
    validateBody(body => (
      body.route != null
    )),
    (req, res, next) => {
      roleService.createAccess(
        parseInt(req.params.id),
        req.body.route,
        req.body.create === 'on',
        req.body.read === 'on',
        req.body.update === 'on',
        req.body.delete === 'on'
      )
      .then(data => {
        console.log(data)
        res.redirect(`/roles/${req.params.id}`)
      })
      .catch(err => next(createHttpError(500, err.message)))
    }
  )

  router.patch('/:id', hasAccess('update', roleService), validateQuery(['role', 'color']), async (req, res) => {
    roleService.updateRole(parseInt(req.params.id), req.body.role, req.body.color)
    res.status(201).redirect(`/roles/${req.params.id}`)
  })

  router.get('/:id/:accessId', hasAccess('read', roleService), async (req, res, next) => {
    roleService.getAccess(parseInt(req.params.accessId))
    .then(async access => {
      console.log(access)
      res.render('roles/access', {
        title: 'Timetracker - Access',
        access: access,
        sidebar: new sidebarComponent(
          '/roles',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
      })
    })
    .catch(err => next(createHttpError(500, err.message)))
  })

  router.post(
    '/:id/:accessId', 
    hasAccess('update', roleService), 
    validateBody(body => body.role != null),
    (req, res, next) => {
      roleService.updateAccess(
        parseInt(req.params.accessId),
        req.body.role,
        req.body.create === 'on',
        req.body.read === 'on',
        req.body.update === 'on',
        req.body.delete === 'on'
      )
      .then(data => {
        console.log(data)
        res.status(201).redirect(`/roles/${req.params.id}`)
      })
      .catch(err => next(createHttpError(500, err.message)))
    }
  )

  return router
}
