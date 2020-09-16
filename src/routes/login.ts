import express from 'express'
import DbService from '../services/db-service'
import fs from 'fs'
import path from 'path'

class LoginRoutes {
  dbService: DbService
  router: express.Router
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', async (_req, res, _next) => {
      res.sendFile(path.join(__dirname + '/../views/login.html'));
    })

    this.router.post('/', async (req, res, _next) => {
      const users = (await this.dbService.getUsers()).rows
      const result = users.find(u => {
        return u.username === req.body.username && u.password === req.body.password
      })
      if (result) {
        req.session.user = result.id
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
