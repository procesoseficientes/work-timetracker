import { Router } from 'express'
import path from 'path'
import { Client } from 'pg'
import { UserService } from '../services/UserService'
import fs from 'fs'
import mustache from 'mustache'

export function LoginRoutes (pgClient: Client): Router {
  const userService: UserService = new UserService(pgClient)
  const router: Router = Router()
  const template = fs.readFileSync(path.join(__dirname, '/../views/login.hbs'), 'utf8')
  
  router.get('/', async (_req, res) => {
    res.send(mustache.render(template, {}))
  })
  
  router.post('/', async (req, res, next) => {
    userService.validateLogin(req.body.username, req.body.password)
    .then(result => {
      if (result && typeof result !== 'boolean') {
        if (req.session) {
          req.session.user = result.id
          req.session.roleId = result.role_id
          req.session.cookie.expires = false
        }
        res.redirect('/')
      } else {
        res.send(mustache.render(template, {error: 'The username and password that you entered did not match our records. Please double-check and try again.'}))
      }
    })
    .catch(err => next(err))
  })
  
  router.get('/signout', async (req, res) => {
    if (req.session) req.session.user = undefined
    res.redirect('/login')
  })
  
  router.post('/api', async (req, res) => {
    const result = await userService.validateLogin(req.body.username, req.body.password)
    if (result && typeof result !== 'boolean') {
      if (req.session) {
        req.session.user = result.id
        req.session.roleId = result.role_id
        req.session.cookie.expires = false
      }
      res.status(200).send({success: true})
    } else {
      res.status(401).send('Unauthorized')
    }
  })
  
  router.delete('/api', async (req, res) => {
    if (req.session) req.session.user = undefined
    res.status(203).send({success: true})
  })
  
  return router
}