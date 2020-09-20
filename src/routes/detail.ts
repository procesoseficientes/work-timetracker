import express from 'express'
import createError from 'http-errors'
import DbService from '../services/db-service'

class DetailRoutes {
  dbService: DbService
  router: express.Router

  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (!req.query.page || req.query.page === '') req.query.page = '0'
        this.dbService.getTimes(
          <string>req.query.name, 
          <string>req.query.owner,
          <string>req.query.project,
          <string>req.query.from === '' ? undefined : <string>req.query.from,
          <string>req.query.to === '' ? undefined : <string>req.query.to,
          parseInt(<string>req.query.page)
        ).then(data => {
          res.render('detail', {
            title: 'Timetracker - Detail',
            detailActive: true,
            times: data.rows
              .slice(0, 26)
              .map(a => {
                a.start = a.start.toString().substring(0, 21)
                a.end = a.end ? a.end.toString().substring(0, 21) : ''
                return a
              }),
            count: data.rows.length,
            total: data.rows
              .slice(0, 26)
              .map(a => a.hours)
              .reduce((a, b) => {
                return ((isNaN(parseFloat(a)) ? 0 : parseFloat(a)) + (isNaN(parseFloat(b)) ? 0 : parseFloat(a))).toFixed(2)
              }, 0),
            page: req.query.page,
            showPrevious: parseInt(<string>req.query.page) > 0,
            showNext: data.rows.length === 26,
            query: req.query
          })
        }).catch(err => {
          console.error(err)
          res.status(500).render('detail', {
            title: 'Timetracker - Detail',
            page: req.query.page,
            times: []
          })
        })
      }
    })
  }
}

export default DetailRoutes