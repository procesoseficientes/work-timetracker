import DbService from '../services/db-service'
import express from 'express'

class OwnersRoutes {
  dbService: DbService
  router: express.Router
  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.render('owners', await this.ownersView())
      }
    })

    this.router.post('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (
          req.body.name
        ) {
          try {
            this.dbService.createOwner(req.body.name)
            res.status(201).render('owners', await this.ownersView()) 
          } catch (error) {
            console.error(error)
            res.status(500).render('owners', await this.ownersView()) 
          }
        } else {
          console.error('Insufficient parameters for request')
          res.status(401).render('owners', await this.ownersView()) 
        }
      }
    })
  }

  async ownersView () {
    return {
      title: 'Timetracker - Owners',
      owners: (await this.dbService.getOwners()).rows
    }
  }
}

export default OwnersRoutes
