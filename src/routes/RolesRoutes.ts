import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { RoleService } from '../services/RoleService'
import { hasAccess } from '../utils/auth'
import { validateBody, validateQuery } from '../utils/validateQuery'

export function RolesRoutes (pgClient: Client): Router {
  const router = Router()
  const roleService = new RoleService(pgClient)

  router.get('/', hasAccess('read', roleService), async (_req, res) => {
    res.render('roles/roles', {
      title: 'Timetracker - Roles',
      sidebar: new sidebarComponent('/roles').render(),
      table: new tableComponent(
        toTableArray(await roleService.getRoles()), 
        true, 
        false,
        './roles'
      ).render()
    })
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
      .catch(err => next(err))
    }
  )

  router.get('/api', hasAccess('read', roleService), async (_req, res, next) => {
    roleService.getRoles()
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => next(err))
  })

  router.get('/:id', hasAccess('read', roleService), async (req, res) => {
    res.render('roles/role', {
      title: `Timetracker - Roles`,
      sidebar: new sidebarComponent('/roles').render(),
      role: await roleService.getRole(parseInt(req.params.id)),
      table: new tableComponent(
        toTableArray(await roleService.getAccessByRole(parseInt(req.params.id))), 
        true, 
        true,
        `/roles/${req.params.id}`
      ).render()
    })
  })

  router.patch('/:id', hasAccess('update', roleService), validateQuery(['role', 'color']), async (req, res) => {
    roleService.updateRole(parseInt(req.params.id), req.body.role, req.body.color)
    res.status(201).redirect(`/roles/${req.params.id}`)
  })

  router.get('/:id/:accessId', hasAccess('read', roleService) , async (req, res) => {
    res.redirect(`/access/${req.params.accessId}`)
  })

  return router
}
