import express from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { pillsComponent } from '../components/pills/pills'
import OwnerService from '../services/OwnerService'

class OwnersRoutes {
  router: express.Router
  pgClient: Client
  ownerService: OwnerService
  
  constructor (pgClient: Client) {
    this.router = express.Router()
    this.ownerService = new OwnerService(pgClient)

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
            this.ownerService.createOwner(req.body.name)
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
  
    this.router.get('/api', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.status(200).send(await this.ownerService.getOwners())
      }
    })

  }

  async ownersView () {
    return {
      title: 'Timetracker - Owners',
      pills: new pillsComponent('detail', '/owners').render(),
      detailActive: true,
      table: new tableComponent(toTableArray(await this.ownerService.getOwners())).render()
    }
  }
}

export default OwnersRoutes
