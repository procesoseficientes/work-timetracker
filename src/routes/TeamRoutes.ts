import express from 'express'
import mapTime from '../utils/mapTime'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import TimeService, { teamTime } from '../services/TimeService'
import { sidebarComponent } from '../components/sidebar/sidebar'

class TeamRoutes {
  timeService: TimeService
  router: express.Router

  constructor (pgClient: Client) {
    this.timeService = new TimeService(pgClient)
    this.router = express.Router()

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        const view = await this.teamView()
        res.render('team', view)
      }
    })
  }

  async teamView(): Promise<{
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
    const teamTimes = groupBy((await this.timeService.getTodayTeam()), 'user_id')
    const grouped = Object.keys(teamTimes).map(a => {
      const g = {
        id: parseInt(a),
        times: teamTimes[a].filter((a: {percent: number, current: number}) => a.percent > 0.5 || a.current)
          .map(mapTime)
          .reverse(),
        task: teamTimes[a][0].task,
        name: teamTimes[a][0].name,
        project: teamTimes[a][0].project,
        owner: teamTimes[a][0].owner
      }
      
      return g
    })

    return {
      title: 'Timetracker - Team',
      sidebar: new sidebarComponent('/team').render(),
      team: grouped
    }
  }
}

export default TeamRoutes