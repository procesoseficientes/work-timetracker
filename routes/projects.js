const express = require('express')
const groupBy = require('../utils/json')
const createError = require('http-errors')

class ProjectsRoutes {
  /**
   * Object for all the `projects` routes
   * @param {DbService} dbService DbService class
   */
  constructor (dbService) {
    this.dbService = dbService
    this.router = express.Router()
    this.colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

    this.router.get('/', async (req, res, next) => {
      if (!req.query.page || req.query.page === '') req.query.page = 0
      res.render('projects', await this.projectsView(req.query.page))
    })

    this.router.post('/', async (req, res, next) => {
      if (!req.query.page || req.query.page === '') req.query.page = 0
      try {
        await this.dbService.insertProjects(
          req.body.owner,
          req.body.name,
          req.body.description
        )
        res.status(201).render('projects', await this.projectsView(req.query.page))
      } catch (error) {
        console.error(error)
        next(createError(500))
      }
    })

    this.router.get('/json', async (req, res, next) => {
      res.send((await this.dbService.getProjects(req.query.id)).rows)
    })
  }

  async projectsView (page) {
    const projects = groupBy((await this.dbService.getProjectsDetail()).rows, 'id')
    const grouped = Object.keys(projects).map(a => {
      const g = {
        id: parseInt(a),
        times: projects[a],
        name: projects[a][0].name,
        description: projects[a][0].description,
        hours: projects[a][0].project_hours
      }
      g.times = g.times.map(b => {
        b.color = this.colors[b.time_id]
        return b
      })
      return g
    })
    return {
      title: 'Timetracker - Projects',
      owners: (await this.dbService.getOwners()).rows,
      projects: grouped,
      page: page
    }
  }
}
module.exports = ProjectsRoutes
