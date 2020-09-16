import DbService from '../services/db-service'
import express from 'express'

class UsersRoutes {
  dbService: DbService
  router: express.Router
  constructor (dbService: DbService) {
    this.dbService = dbService
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
            this.dbService.createUser(req.body.name, req.body.username, req.body.password)
            res.status(201).render('users', await this.usersView()) 
          } catch (error) {
            console.error(error)
            res.status(500).render('users', await this.usersView()) 
          }
        } else {
          console.error('Insufficient parameters for request')
          res.status(401).render('users', await this.usersView()) 
        }
      }
    })
  }

  async usersView () {
    return {
      title: 'Timetracker - Users',
      users: (await this.dbService.getUsers()).rows
    }
  }
}

export default UsersRoutes
