import { Router } from 'express'
import { Client } from 'pg'
import { sidebarComponent } from '../components/sidebar/sidebar'
import TimeService from '../services/TimeService'
import { Parser } from 'json2csv'
import { hasAccess } from '../utils/auth'
import { RoleService } from '../services/RoleService'
import createHttpError from 'http-errors'
import { Converter } from 'showdown'

export function DetailRoutes(pgClient: Client): Router {
  const router: Router = Router()
  const timeService = new TimeService(pgClient)
  const roleService = new RoleService(pgClient)

  router.get('/', hasAccess('read', roleService), (req, res) => {
    if (!req.query.page || req.query.page === '') req.query.page = '0'
    timeService.getTimes(
      <string>req.query.name, 
      <string>req.query.owner,
      <string>req.query.project,
      <string>req.query.from === '' ? undefined : <string>req.query.from,
      <string>req.query.to === '' ? undefined : <string>req.query.to,
      parseInt(<string>req.query.page)
    ).then(async data => {
      res.render('detail', {
        title: 'Timetracker - Times',
        sidebar: new sidebarComponent(
          '/detail',
          await roleService.getAccessByRole(req.session?.roleId)
        ).render(),
        times: data
          .slice(0, 26)
          .map(a => {
            a.start = a.start.toString().substring(0, 21)
            a.end = a.end ? a.end.toString().substring(0, 21) : ''
            a.task = new Converter({simplifiedAutoLink: true, simpleLineBreaks: true}).makeHtml(a.task)
            return a
          }),
        count: data.length,
        total: data
          .slice(0, 26)
          .map(a => a.hours)
          .reduce((a: number, b: string) => {
            return a + (isNaN(parseFloat(b)) ? 0 : parseFloat(b))
          }, 0).toFixed(2),
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
  })

  router.get('/api', hasAccess('read', roleService), async (req, res) => {
    if (!req.query.page || req.query.page === '') req.query.page = '0'
    res.status(200).send(
      await timeService.getTimes(
        <string>req.query.name, 
        <string>req.query.owner,
        <string>req.query.project,
        <string>req.query.from === '' ? undefined : <string>req.query.from,
        <string>req.query.to === '' ? undefined : <string>req.query.to,
        parseInt(<string>req.query.page)
      )
    )
  })
  
  router.get('/excel', hasAccess('read', roleService), async (req, res, next) => {
    if (!req.query.page || req.query.page === '') req.query.page = '0'
    timeService.getTimes(
      <string>req.query.name, 
      <string>req.query.owner,
      <string>req.query.project,
      <string>req.query.from === '' ? undefined : <string>req.query.from,
      <string>req.query.to === '' ? undefined : <string>req.query.to,
      0,
      10000
    ).then(data => {
      // @fabrv
      // JSONtoCSV crahses if the input date is empty
      // This will line will create an empty row so JSONtoCSV can work
      data = data.length === 0 ? [{ name: '', owner: '', project: '', task: '', start: '', end: '', hours: ''}] : data
      
      const parser = new Parser()
      const csv = parser.parse(data)

      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="Times.csv"`,
        'Content-Type': 'text/csv',
      })
      
      res.end(csv)

    }).catch(err => {
      console.error(err)
      next(createHttpError(500, err.message))
    })
  })

  return router
}
