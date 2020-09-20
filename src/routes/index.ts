import express from 'express'
import createError from 'http-errors'
import mapTime from '../utils/mapTime'
import DbService from '../services/db-service'

class IndexRoutes {
  dbService: DbService
  router: express.Router

  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', async (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        try {
          res.render('track', await this.trackView(req.session.user))
        } catch (error) {
          console.log(error)
          res.status(500).send(error)
        }
      }
    })

    this.router.post('/', async (req, res, next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        try {
          await this.dbService.startTracking(
            req.session.user,
            req.body.owner,
            req.body.project,
            req.body.task
          )
          res.status(201).redirect('/')
        } catch (error) {
          console.error(error)
          next(createError(500))
        }
      }
    })

    this.router.delete('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.send((await this.dbService.stopTracking(req.body.id)).rows)
      }
    })
  }
  
  async trackView(userId: number) {
    const owners = (await this.dbService.getOwners()).rows
    const times = (await this.dbService.getTodayUser(userId)).rows
    return {
      title: 'Timetracker',
      trackActive: true,
      owners: owners,
      isWorking: times[0] ? times[0].current : false,
      lastTask: times[0] ?  times[0].task : '',
      times: times.filter(a => a.percent > 0.5 || a.current)
                  .map(mapTime)
                  .reverse(),
      userId: userId
    }
  }
  
}

export default IndexRoutes
