import express from 'express'
import mapTime from '../utils/mapTime'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import TimeService from '../services/TimeService'

class TeamRoutes {
  timeService: TimeService
  router: express.Router

  constructor (pgClient: Client) {
    this.timeService = new TimeService(pgClient)
    this.router = express.Router()

    this.router.get('/', async (req, res, _next) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        const view = await this.teamView()
        res.render('team', view)
      }
    })
  }

  async teamView() {
    const teamTimes = groupBy((await this.timeService.getTodayTeam()).rows, 'user_id')
    const grouped = Object.keys(teamTimes).map(a => {
      const g = {
        id: parseInt(a),
        times: teamTimes[a].filter((a: any) => a.percent > 0.5 || a.current)
          .map(mapTime)
          .reverse(),
        task: teamTimes[a][0].task,
        name: teamTimes[a][0].name,
        project: teamTimes[a][0].project
      }
      
      return g
    })

    return {
      title: 'Timetracker - Team',
      statsActive: true,
      team: grouped
    }
  }
}

export default TeamRoutes