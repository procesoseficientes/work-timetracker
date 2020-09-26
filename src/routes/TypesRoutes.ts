import express from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { pillsComponent } from '../components/pills/pills'
import TypeService from '../services/TypeService'

class TypesRoutes {
  router: express.Router
  pgClient: Client
  typeService: TypeService
  
  constructor (pgClient: Client) {
    this.router = express.Router()
    this.typeService = new TypeService(pgClient)

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.render('types', await this.typesView())
      }
    })

    this.router.post('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (
          req.body.type
        ) {
          try {
            this.typeService.createType(req.body.type)
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
  
    this.router.get('/api', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.status(200).send(await this.typeService.getTypes())
      }
    })

  }

  async typesView () {
    return {
      title: 'Timetracker - Types',
      pills: new pillsComponent('detail', '/types').render(),
      detailActive: true,
      table: new tableComponent(toTableArray(await this.typeService.getTypes())).render()
    }
  }
}

export default TypesRoutes
