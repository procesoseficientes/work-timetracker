import { Router } from 'express'
import { Client } from 'pg'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import UserService from '../services/UserService'
import { tableComponent } from '../components/table/table'
import { Parser } from 'json2csv'

export function UsersRoutes(pgClient: Client): Router {
  const userService = new UserService(pgClient)
  const router = Router()

  router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
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
    }
  })

  router.post('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (
        req.body.name &&
        req.body.username && 
        req.body.password
      ) {
        try {
          userService.createUser(req.body.name, req.body.username, req.body.password)
          res.status(201).redirect('/users')
        } catch (error) {
          console.error(error)
          res.status(500).redirect('/users')
        }
      } else {
        console.error('Insufficient parameters for request')
        res.status(401).redirect('/users')
      }
    }
  })

  router.get('/api', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await userService.getUsers())
    }
  })

  router.get('/excel', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await userService.getUsers()
        .then(data=>{

          const parser = new Parser()
          const csv = parser.parse(data)

          res.writeHead(200, {
            'Content-Disposition': `attachment; filename="Users.csv"`,
            'Content-Type': 'text/csv',
          })
          
          res.end(csv)

        }).catch(err =>{
          console.error(err)
          res.status(500).render('detail', {
            title: 'Timetracker - Times',
            page: req.query.page,
            times: []
        })
        })
      )
    }
  })

  return router
}