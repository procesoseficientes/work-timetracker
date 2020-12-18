import { Router } from 'express'
import path from 'path'
import { Client } from 'pg'
import UserService from '../services/UserService'
import fs from 'fs'
import mustache from 'mustache'

export function LoginRoutes (pgClient: Client): Router {
  const userService: UserService = new UserService(pgClient)
  const router: Router = Router()
  const template = fs.readFileSync(path.join(__dirname, '/../views/login.html'), 'utf8')
  
  router.get('/', async (_req, res) => {
    res.send(mustache.render(template, {}))
  })
  
  router.post('/', async (req, res) => {
    const users = await userService.getUsers()
    const result = users.find(u => {
      return u.username.toLowerCase() === req.body.username.toLowerCase() && u.password === req.body.password
    })
    if (result) {
      req.session.user = result.id
      req.session.cookie.expires = false
      res.redirect('/')
    } else {
      res.send(mustache.render(template, {error: 'The username and password that you entered did not match our records. Please double-check and try again.'}))
    }
  })
  
  router.get('/signout', async (req, res) => {
    req.session.user = undefined
    res.redirect('/login')
  })
  
  router.post('/api', async (req, res) => {
    const users = await userService.getUsers()
    const result = users.find(u => {
      return u.username.toLowerCase() === req.body.username.toLowerCase() && u.password === req.body.password
    })
    if (result) {
      req.session.user = result.id
      req.session.cookie.expires = false
      res.status(200).send({success: true})
    } else {
      res.status(401).sendFile('Unauthorized')
    }
  })
  
  router.delete('/api', async (req, res) => {
    req.session.user = undefined
    res.status(203).send({success: true})
  })
  
  return router
}