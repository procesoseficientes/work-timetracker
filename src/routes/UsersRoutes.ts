import { Router } from 'express'
import { Client } from 'pg'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { UserService } from '../services/UserService'
import { tableComponent } from '../components/table/table'
import { Parser } from 'json2csv'
import { hasAccess } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'
import { RoleService } from '../services/RoleService'
import createHttpError from 'http-errors'

export function UsersRoutes(pgClient: Client): Router {
  const userService = new UserService(pgClient)
  const roleService = new RoleService(pgClient)
  const router = Router()

  router.get('/', hasAccess('read', roleService), async (req, res, next) => {
    roleService.getAccessByRouteAndRole('/projects', req.session?.roleId)
    .then(async access => {
      res.render('users/users', {
        title: 'Timetracker - Users',
        sidebar: new sidebarComponent(
          '/users',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        access: access,
        table: new tableComponent(
          toTableArray(await userService.getUsers()), 
          access.update, 
          access.delete,
          './users'
        ).render(),
        roles: await roleService.getRoles()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.post('/', hasAccess('create', roleService), validateBody(body => 
    body.name != null && body.username != null && body.password != null && body.role
  ), async (req, res) => {
    try {
      userService.createUser(req.body.name, req.body.username, req.body.password, req.body.role)
      res.status(201).redirect('/users')
    } catch (error) {
      console.error(error)
      res.status(500).redirect('/users')
    }
  })

  router.get('/api', hasAccess('read', roleService), (_req, res, next) => {
    userService.getUsers()
    .then(data => res.status(200).send(data))
    .catch(err => next(createHttpError(500, err.message)))
  })

  router.put('/api/:id/toggle', hasAccess('update', roleService), (req, res) => {
    userService.toggleState(parseInt(req.params.id)).then(data => {
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

  router.get('/:id', hasAccess('read', roleService), (req, res, next) => {
    userService.getUser(parseInt(req.params.id))
    .then(async data => {
      res.render('users/user', {
        title: 'Timetracker - ' + data.username,
        sidebar: new sidebarComponent(
          '/users',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        user: data,
        roles: await roleService.getRoles()
      })
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.delete('/:id', hasAccess('delete', roleService), (req, res, next) => {
    userService.deleteUser(parseInt(req.params.id))
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.post('/:id', hasAccess('read', roleService), (req, res, next) => {
    userService.updateUser(
      parseInt(req.params.id),
      req.body.name,
      req.body.username,
      true,
      req.body.role
    )
    .then(data => {
      console.log(data)
      res.status(203).redirect('/users')
    })
    .catch(err => next(createHttpError(err.message)))
  })

  router.get('/excel', hasAccess('read', roleService) ,async (_req, res, next) => {
    userService.getUsers().then(data=>{
      const parser = new Parser()
      const csv = parser.parse(data)

      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="Users.csv"`,
        'Content-Type': 'text/csv',
      })
      
      res.end(csv)

    }).catch(err => next(createHttpError(500, err.message)))
  })

  return router
}