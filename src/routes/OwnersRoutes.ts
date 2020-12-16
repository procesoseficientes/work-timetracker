import { Router } from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import OwnerService from '../services/OwnerService'
import { Parser } from 'json2csv'

export function OwnersRoutes(pgClient: Client): Router {
  const router = Router()
  const ownerService = new OwnerService(pgClient)
  
  router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.render('owners', {
        title: 'Timetracker - Owners',
        sidebar: new sidebarComponent('/owners').render(),
        table: new tableComponent(
          toTableArray(await ownerService.getOwners()), 
          true, 
          false,
          './owners'
        ).render()
      })
    }
  })
  
  router.post('/', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      if (req.body.name) {
        try {
          ownerService.createOwner(req.body.name)
          res.status(201).redirect('/owners')
        } catch (error) {
          console.error(error)
          res.status(500).redirect('/owners')
        }
      } else {
        console.error('Insufficient parameters for request')
        res.status(401).redirect('/owners')
      }
    }
  })
    
  router.get('/api', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await ownerService.getOwners())
    }
  })
    
  router.get('/excel', async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect('/login')
    } else {
      res.status(200).send(await ownerService.getOwners()
      .then(data => {
        const parser = new Parser()
        const csv = parser.parse(data)
        
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename="Owners.csv"`,
          'Content-Type': 'text/csv',
        })
        res.end(csv)
        
      }).catch(err => {
        console.error(err)
        res.status(500).render('detail', {
          title: 'Timetracker - Times',
          page: req.query.page,
          times: []
        })
      }))
    }
  })

  return router
}