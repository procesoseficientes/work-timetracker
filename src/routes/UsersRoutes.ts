import express from 'express'
import { Client } from 'pg'
import { pillsComponent } from '../components/pills/pills'
import UserService from '../services/UserService'

class UsersRoutes {
  userService: UserService
  router: express.Router
  constructor (pgClient: Client) {
    this.userService = new UserService(pgClient)
    this.router = express.Router()

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.render('users', await this.usersView())
      }
    })

    this.router.post('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (
          req.body.name &&
          req.body.username && 
          req.body.password
        ) {
          try {
            this.userService.createUser(req.body.name, req.body.username, req.body.password)
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
  
    this.router.get('/api', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.status(200).send(await this.userService.getUsers())
      }
    })

  }

  async usersView () {
    return {
      title: 'Timetracker - Users',
      pills: new pillsComponent('detail', '/users').render(),
      detailActive: true,
      users: await this.userService.getUsers()
    }
  }
}

export default UsersRoutes
