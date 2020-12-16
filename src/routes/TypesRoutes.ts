import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import TypeService from '../services/TypeService'

export function TypesRoutes (pgClient: Client): Router {
  const router = Router()
  const typeService = new TypeService(pgClient)

  router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
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
    }
  })

  router.post('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (
        req.body.type
      ) {
        try {
          typeService.createType(req.body.type)
          res.status(201).redirect('/types')
        } catch (error) {
          console.error(error)
          res.status(500).redirect('/types')
        }
      } else {
        console.error('Insufficient parameters for request')
        res.status(401).redirect('/types')
      }
    }
  })

  router.get('/api', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await typeService.getTypes())
    }
  })

  return router
}
