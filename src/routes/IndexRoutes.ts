import { Router } from 'express'
import createError from 'http-errors'
import { Client } from 'pg'
import TypeService from '../controllers/TypeService'
import OwnerService from '../controllers/OwnerService'
import TimeService from '../controllers/TimeService'
import mapTime from '../utils/mapTime'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { authenticated, hasAccess } from '../utils/auth'
import { RoleService } from '../controllers/RoleService'

export function IndexRoutes (pgClient: Client): Router {
  const timeService = new TimeService(pgClient)
  const ownerService = new OwnerService(pgClient)
  const typeService = new TypeService(pgClient)
  const roleService = new RoleService(pgClient)
  const router = Router()

  router.get('/', authenticated, async (req, res) => {
    try {
      const times = await timeService.getTodayUser(parseInt(req.session?.user || ""))
      res.render('track', {
        title: 'Timetracker',
        sidebar: new sidebarComponent(
          '/',
          await roleService.getAccessByRole(req.session?.roleId || 0)
        ).render(),
        owners: await ownerService.getOwners(),
        types: await typeService.getTypes(),
        isWorking: times[0] ? times[0].current : false,
        lastTask: times[0] ?  times[0].task : '',
        times: times.map(mapTime).reverse(),
        userId: req.session?.user
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  })

  router.post('/', hasAccess('create', roleService), async (req, res, next) => {
    try {
      await timeService.startTracking(
        parseInt(req.session?.user || ""),
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

  router.delete('/', hasAccess('delete', roleService), async (req, res) => {
    res.send(await timeService.stopTracking(req.body.id))
  })

  router.delete('/api', hasAccess('delete', roleService), async (req, res) => {
    res.send(await timeService.stopTracking(req.body.id))
  })

  router.get('/api', authenticated, async (req, res) => {
    try {
      res.send(await timeService.getTodayUser(parseInt(req.session?.user || "")))
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  })

  router.post('/api', hasAccess('create', roleService) , async (req, res, next) => {
    try {
      res.status(201).send(await timeService.startTracking(
        parseInt(req.session?.user || ""),
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
