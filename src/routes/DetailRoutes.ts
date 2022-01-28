import { Router } from 'express'
import { Client } from 'pg'
import { sidebarComponent } from '../components/sidebar/sidebar'
import TimeService from '../controllers/TimeService'
import { hasAccess } from '../utils/auth'
import { RoleService } from '../controllers/RoleService'
import createHttpError from 'http-errors'
import { Converter } from 'showdown'
import { DetailReport } from '../components/detailReport/detailReport'

import { mdToPdf } from 'md-to-pdf'

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
          await roleService.getAccessByRole(req.session?.roleId || 0)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.get('/excel', hasAccess('read', roleService), (req, res: any, next) => {
    if (!req.query.page || req.query.page === '') req.query.page = '0'
    timeService.getTimes(
      req.query.name?.toString(),
      req.query.owner?.toString(),
      req.query.project?.toString(),
      req.query.from?.toString() === '' ? undefined : req.query.from?.toString(),
      req.query.to?.toString() === '' ? undefined : req.query.to?.toString(),
      0,
      10000
    ).then(data => {
      // @fabrv
      // JSONtoXls crahses if the input date is empty
      // This will line will create an empty row so JSONtoCSV can work
      data = data.length === 0 ? [{ name: '', owner: '', project: '', task: '', start: '', end: '', hours: ''}] : data

      res.xls(`${req.query.name}-${req.query.from}-${req.query.to}.xlsx`, data)

    }).catch(err => {
      console.error(err)
      next(createHttpError(500, err.message))
    })
  })

  router.get('/pdf', hasAccess('read', roleService), async (req, res) => {
    const times = (await timeService.getTimes(
      req.query.name?.toString(),
      req.query.owner?.toString(),
      req.query.project?.toString(),
      req.query.from?.toString() === '' ? undefined : req.query.from?.toString(),
      req.query.to?.toString() === '' ? undefined : req.query.to?.toString(),
      0,
      10000
    )).map(time => {
      time.start = (new Date(time.start)).toISOString().substring(0, 10),
      time.end = (new Date(time.end)).toISOString().substring(0, 10)
      time.task = time.task.slice(0, 15) + (time.task.length > 15 ? '...' : '')
      return time
    })

    const data = times.length === 0 ? [{ name: '', owner: '', project: '', task: '', start: '', end: '', hours: ''}] : times

    const reportComponent = new DetailReport({
      name: req.query.name?.toString() || '',
      owner: req.query.owner?.toString() || '',
      project: req.query.project?.toString() || '',
      end: req.query.to?.toString() || '',
      start: req.query.from?.toString() || '',
      hours: '',
      task: '',      
      data: data,
      totalHours: data.reduce((acc, curr) => acc + parseFloat(curr.hours), 0)
    })

    const pdf = await mdToPdf({content: reportComponent.render()}).catch(console.error)

    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="Times.pdf"`,
      'Content-Type': 'application/pdf',
    })

    res.end(pdf?.content)
  })

  return router
}
