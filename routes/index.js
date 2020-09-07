var express = require('express')
const createError = require('http-errors')

class IndexRoutes {
  constructor (dbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', (req, res, next) => {
      this.dbService.getOwners().then(data => {
        res.render('track', {
          title: 'Timetracker',
          owners: data.rows
        })
      }).catch(err => {
        res.status(500).semd(err)
      })
    })

    this.router.post('/', async (req, res, next) => {
      try {
        await this.dbService.startTracking(
          1,
          req.body.owner,
          req.body.project,
          req.body.task
        )
        res.status(201).render('track', {
          title: 'Timetracker',
          owners: (await this.dbService.getOwners()).rows
        })
      } catch (error) {
        console.error(error)
        next(createError(500))
      }
    })

    this.router.get('/detail', (req, res, next) => {
      if (!req.query.page || req.query.page === '') req.query.page = 0
      this.dbService.getTimes(
        req.query.name,
        req.query.owner,
        req.query.project,
        req.query.from === '' ? undefined : req.query.from,
        req.query.to === '' ? undefined : req.query.to,
        req.query.page
      ).then(data => {
        res.render('detail', {
          title: 'Timetracker - Detail',
          times: data.rows
            .slice(0, 51)
            .map(a => {
              a.start = a.start.toString().substring(0, 21)
              a.end = a.end ? a.end.toString().substring(0, 21) : ''
              return a
            }),
          count: data.rows.length,
          total: data.rows
            .slice(0, 51)
            .map(a => a.hours)
            .reduce((a, b) => {
              return a + b
            }),
          page: req.query.page,
          showPrevious: parseInt(req.query.page) > 0,
          showNext: data.rows.length === 51
        })
      }).catch(err => {
        console.error(err)
        res.status(500).render('detail', {
          title: 'Timetracker - Detail',
          page: req.query.page,
          times: []
        })
      })
    })

    this.router.get('/team', (req, res, next) => {
      const colors = ['bg-primary', 'bg-secondary', 'bg-danger', 'bg-warning', 'bg-info']
      res.render('team', {
        title: 'Timetracker - Team',
        team: [
          {
            id: 1,
            name: 'Pedro Ramirez',
            task: 'Ticket de soport #1324',
            times: [
              {
                owner: 'Arium',
                color: colors[parseInt(Math.random() * colors.length)],
                current: false,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              },
              {
                owner: 'Lunch',
                color: colors[parseInt(Math.random() * colors.length)],
                current: false,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              },
              {
                owner: 'Alza',
                color: colors[parseInt(Math.random() * colors.length)],
                current: true,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              }
            ]
          },
          {
            id: 2,
            name: 'Juan Perez',
            task: 'Salí al banco',
            times: [
              {
                owner: 'FERCO',
                color: colors[parseInt(Math.random() * colors.length)],
                current: false,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              },
              {
                owner: 'Arium',
                color: colors[parseInt(Math.random() * colors.length)],
                current: false,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              },
              {
                owner: 'Break',
                color: colors[parseInt(Math.random() * colors.length)],
                current: true,
                hours: parseInt(Math.random() * 8) + 1,
                percent: parseInt(Math.random() * 33) + 10
              }
            ]
          }
        ]
      })
    })
  }
}

module.exports = IndexRoutes
