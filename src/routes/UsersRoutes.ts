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

export function UsersRoutes(pgClient: Client): Router {
  const userService = new UserService(pgClient)
  const roleService = new RoleService(pgClient)
  const router = Router()

  router.get('/', hasAccess('read', roleService), async (_req, res) => {
    res.render('users', {
      title: 'Timetracker - Users',
      sidebar: new sidebarComponent('/users').render(),
      table: new tableComponent(
        toTableArray(await userService.getUsers()), 
        true, 
        false,
        './users'
      ).render()
    })
  })

  router.post('/', hasAccess('create', roleService), validateBody(body => 
    body.name != null && body.username != null && body.password != null
  ), async (req, res) => {
    try {
      userService.createUser(req.body.name, req.body.username, req.body.password)
      res.status(201).redirect('/users')
    } catch (error) {
      console.error(error)
      res.status(500).redirect('/users')
    }
  })

  router.get('/api', hasAccess('read', roleService), (_req, res, next) => {
    userService.getUsers()
    .then(data => res.status(200).send(data))
    .catch(err => next(err))
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

    }).catch(err => next(err))
  })

  return router
}