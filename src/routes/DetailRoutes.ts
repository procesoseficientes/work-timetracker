import express from 'express'
import { Client } from 'pg'
import { pillsComponent } from '../components/pills/pills'
import TimeService from '../services/TimeService'

class DetailRoutes {
  timeService: TimeService
  router: express.Router

  constructor (pgClient: Client) {
    this.timeService = new TimeService(pgClient)
    this.router = express.Router()

    this.router.get('/', (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (!req.query.page || req.query.page === '') req.query.page = '0'
        this.timeService.getTimes(
          <string>req.query.name, 
          <string>req.query.owner,
          <string>req.query.project,
          <string>req.query.from === '' ? undefined : <string>req.query.from,
          <string>req.query.to === '' ? undefined : <string>req.query.to,
          parseInt(<string>req.query.page)
        ).then(data => {
          res.render('detail', {
            title: 'Timetracker - Times',
            pills: new pillsComponent('detail', '/detail').render(),
            detailActive: true,
            times: data
              .slice(0, 26)
              .map(a => {
                a.start = a.start.toString().substring(0, 21)
                a.end = a.end ? a.end.toString().substring(0, 21) : ''
                return a
              }),
            count: data.length,
            total: data
              .slice(0, 26)
              .map(a => a.hours)
              .reduce((a: any, b: any) => {
                return a + (isNaN(parseFloat(b)) ? 0 : parseFloat(b))
              }, 0),
            page: req.query.page,
            showPrevious: parseInt(<string>req.query.page) > 0,
            showNext: data.length === 26,
            query: req.query
          })
        }).catch(err => {
          console.error(err)
          res.status(500).render('detail', {
            title: 'Timetracker - Times',
            page: req.query.page,
            times: []
          })
        })
      }
    })
  
    this.router.get('/api', async (req, res) => {
      if (!req.query.page || req.query.page === '') req.query.page = '0'
      res.status(200).send(
        await this.timeService.getTimes(
          <string>req.query.name, 
          <string>req.query.owner,
          <string>req.query.project,
          <string>req.query.from === '' ? undefined : <string>req.query.from,
          <string>req.query.to === '' ? undefined : <string>req.query.to,
          parseInt(<string>req.query.page)
        )
      )
    })
  }
}

export default DetailRoutes