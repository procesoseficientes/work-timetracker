import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { RoleService } from '../services/RoleService'

export function RolesRoutes (pgClient: Client): Router {
  const router = Router()
  const roleService = new RoleService(pgClient)

  router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
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
    }
  })

  router.post('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (
        req.body.role &&
        req.body.color
      ) {
        try {
          roleService.createRole(req.body.role, req.body.color)
          res.status(201).redirect('/roles')
        } catch (error) {
          console.error(error)
          res.status(500).redirect('/roles')
        }
      } else {
        console.error('Insufficient parameters for request')
        res.status(401).redirect('/roles')
      }
    }
  })

  router.get('/:id', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
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
    }
  })

  router.patch('/:id', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (req.query.role && req.query.color) {
        roleService.updateRole(parseInt(req.params.id), req.body.role, req.body.color)
        res.status(201).redirect(`/roles/${req.params.id}`)
      }
    }
  })

  router.get('/:id/:accessId', async (req, res) => {
    res.redirect(`/access/${req.params.accessId}`)
  })

  router.get('/api', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await roleService.getRoles())
    }
  })

  return router
}
