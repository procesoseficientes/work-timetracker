var express = require('express')

class UsersRoutes {
  constructor (dbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', (req, res, next) => {
      res.render('users', { title: 'Timetracker - Users' })
    })

    this.router.post('/', (req, res, next) => {
      console.log(req.body)
      res.status(201).render('users', { title: 'Timetracker - Users' })
    })
  }
}

module.exports = UsersRoutes
