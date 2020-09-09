import DbService from '../services/db-service'
import express from 'express'

class UsersRoutes {
  dbService: DbService
  router: express.Router
  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', (req, res) => {
      res.render('users', { title: 'Timetracker - Users' })
    })

    this.router.post('/', (req, res) => {
      console.log(req.body)
      res.status(201).render('users', { title: 'Timetracker - Users' })
    })
  }
}

export default UsersRoutes
