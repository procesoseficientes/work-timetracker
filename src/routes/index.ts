import express from 'express'
import createError from 'http-errors'
import DbService from '../services/db-service'
import { groupBy } from '../utils/json'

class IndexRoutes {
  dbService: DbService
  router: express.Router
  colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  constructor (dbService: DbService) {
    this.dbService = dbService
    this.router = express.Router()

    this.router.get('/', async (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        try {
          res.render('track', await this.trackView(req.session.user))
        } catch (error) {
          console.log(error)
          res.status(500).send(error)
        }
      }
    })

    this.router.post('/', async (req, res, next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        try {
          await this.dbService.startTracking(
            req.session.user,
            req.body.owner,
            req.body.project,
            req.body.task
          )
          res.status(201).render('track', await this.trackView(req.session.user))
        } catch (error) {
          console.error(error)
          next(createError(500))
        }
      }
    })

    this.router.delete('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.send((await this.dbService.stopTracking(req.body.id)).rows)
      }
    })

    this.router.get('/detail', (req, res, _next) => {
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
                return (parseFloat(a) + parseFloat(b)).toFixed(2)
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

    this.router.get('/team', async (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        const view = await this.teamView()
        res.render('team', view)
      }
    })
  }
  
  async trackView(userId: number) {
    const owners = (await this.dbService.getOwners()).rows
    const times = (await this.dbService.getTodayUser(userId)).rows
    return {
      title: 'Timetracker',
      trackActive: true,
      owners: owners,
      isWorking: times[0] ? times[0].current : false,
      lastTask: times[0] ?  times[0].task : '',
      times: times.filter(a => a.percent > 0.5 || a.current)
                  .map(this.mapTime)
                  .reverse(),
      userId: userId
    }
  }

  async teamView() {
    const teamTimes = groupBy((await this.dbService.getTodayTeam()).rows, 'user_id')
    const grouped = Object.keys(teamTimes).map(a => {
      const g = {
        id: parseInt(a),
        times: teamTimes[a].filter((a: any) => a.percent > 0.5 || a.current)
          .map(this.mapTime)
          .reverse(),
        task: teamTimes[a][0].task,
        name: teamTimes[a][0].name,
        project: teamTimes[a][0].project
      }
      
      return g
    })

    return {
      title: 'Timetracker - Team',
      teamActive: true,
      team: grouped
    }
  }

  mapTime(element: any, index: number) {
    const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']
    const start = new Date(element.start).getTime()
    if (element.current) {
      element.hours = (new Date().getTime() - start) / 3600000
      element.percent = ((element.hours / 8) * 100) + 3
    }
    const hoursSplit = element.hours.toString().split('.')
    element.color = colors[index]
    element.hours = hoursSplit[0] + '.' + hoursSplit[1][0];
    return element
  }
}

export default IndexRoutes
