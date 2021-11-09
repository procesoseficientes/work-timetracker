import { Router } from 'express'
import mapTime from '../utils/mapTime'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import TimeService from '../controllers/TimeService'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { hasAccess } from '../utils/auth'
import { RoleService } from '../controllers/RoleService'
import createHttpError from 'http-errors'
import { Converter } from 'showdown'
import { teamTime } from '../models/time'

export function TeamRoutes (pgClient: Client): Router {
  const timeService = new TimeService(pgClient)
  const router = Router()
  const roleService = new RoleService(pgClient)

  router.get('/', hasAccess('read', roleService), async (req, res, next) => {
    teamView(req.session?.roleId || 0)
    .then(data => {
      res.render('team', data)
    })
    .catch(err => next(createHttpError(500, err.message)))
  })

  async function teamView(roleId: number): Promise<{
    title: string
    sidebar: string
    team: {
      id: number
      times: teamTime
      task: string
      name: string
      project: string
      owner: string
    }[]
}> {
    const teamTimes = groupBy((await timeService.getTodayTeam()), 'user_id')

    const grouped = Object.keys(teamTimes).map(a => {
      const g = {
        id: parseInt(a),
        times: teamTimes[a].map(mapTime).reverse(),
        task: '',//new Converter({simplifiedAutoLink: true, simpleLineBreaks: true}).makeHtml(teamTimes[a][0].task),
        name: teamTimes[a][0].name,
        project: teamTimes[a][0].project,
        owner: teamTimes[a][0].owner
      }

      return g
    })


    return {
      title: 'Timetracker - Team',
      sidebar: new sidebarComponent(
        '/team',
        await roleService.getAccessByRole(roleId)
      ).render(),
      team: grouped
    }
  }

  return router
}
