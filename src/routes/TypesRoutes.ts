import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import TypeService from '../services/TypeService'
import { authenticated } from '../utils/auth'
import { validateBody } from '../utils/validateQuery'

export function TypesRoutes (pgClient: Client): Router {
  const router = Router()
  const typeService = new TypeService(pgClient)

  router.get('/', authenticated, async (_req, res) => {
    res.render('types', {
      title: 'Timetracker - Types',
      sidebar: new sidebarComponent('/types').render(),
      table: new tableComponent(
        toTableArray(await typeService.getTypes()), 
        true, 
        false,
        './types'
      ).render()
    })
  })

  router.post('/', authenticated, validateBody(body => body.type != null), async (req, res, next) => {
    typeService.createType(req.body.type)
    .then(data => {
      console.log(data)
      res.status(201).redirect('/types')
    })
    .catch(err => next(err))
  })

  router.get('/api', authenticated, async (_req, res, next) => {
    typeService.getTypes()
    .then(data => res.status(200).send(data))
    .catch(err => next(err))
  })

  return router
}
