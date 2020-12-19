import { Router } from 'express'
import createError from 'http-errors'
import { Client } from 'pg'
import TypeService from '../services/TypeService'
import OwnerService from '../services/OwnerService'
import TimeService from '../services/TimeService'
import mapTime from '../utils/mapTime'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { authenticated } from '../utils/auth'

export function IndexRoutes (pgClient: Client): Router {
  const timeService = new TimeService(pgClient)
  const ownerService = new OwnerService(pgClient)
  const typeService = new TypeService(pgClient)
  const router = Router()
  
  router.get('/', authenticated ,async (req, res) => {
    try {
      const times = await timeService.getTodayUser(req.session?.user)
      res.render('track', {
        title: 'Timetracker',
        sidebar: new sidebarComponent('/').render(),
        owners: await ownerService.getOwners(),
        types: await typeService.getTypes(),
        isWorking: times[0] ? times[0].current : false,
        lastTask: times[0] ?  times[0].task : '',
        times: times.filter(a => a.percent > 0.5 || a.current)
        .map(mapTime)
        .reverse(),
        userId: req.session?.user
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  })
  
  router.post('/', authenticated, async (req, res, next) => {
    try {
      await timeService.startTracking(
        req.session?.user,
        req.body.owner,
        req.body.project,
        req.body.task,
        req.body.type
      )
      res.status(201).redirect('/')
    } catch (error) {
      console.error(error)
      next(createError(500))
    }
  })
    
  router.delete('/', authenticated, async (req, res) => {
    res.send(await timeService.stopTracking(req.body.id))
  })
    
  router.delete('/api', authenticated, async (req, res) => {
    res.send(await timeService.stopTracking(req.body.id))
  })
    
  router.get('/api', authenticated, async (req, res) => {
    try {
      res.send(await timeService.getTodayUser(req.session?.user))
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  })
    
  router.post('/api', authenticated , async (req, res, next) => {
    try {
      res.status(201).send(await timeService.startTracking(
        req.session?.user,
        req.body.owner,
        req.body.project,
        req.body.task,
        req.body.type
      ))
    } catch (error) {
      console.error(error)
      next(createError(500))
    }
  })

  return router
}