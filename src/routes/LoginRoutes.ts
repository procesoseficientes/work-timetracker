import express from 'express'
import path from 'path'
import { Client } from 'pg'
import UserService from '../services/UserService'

class LoginRoutes {
  userService: UserService
  router: express.Router
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (pgClient: Client) {
    this.userService = new UserService(pgClient)
    this.router = express.Router()

    this.router.get('/', async (_req, res, _next) => {
      res.sendFile(path.join(__dirname + '/../views/login.html'));
    })

    this.router.post('/', async (req, res, _next) => {
      const users = await this.userService.getUsers()
      const result = users.find(u => {
        return u.username.toLowerCase() === req.body.username.toLowerCase() && u.password === req.body.password
      })
      if (result) {
        req.session.user = result.id
        req.session.cookie.expires = false
        res.redirect('/')
      } else {
        res.status(401).sendFile(path.join(__dirname + '/../views/login.html'));
      }
    })

    this.router.get('/signout', async (req, res, _next) => {
      req.session.user = undefined
      res.redirect('/login')
    })
  }
}

export default LoginRoutes
