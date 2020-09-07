const express = require('express')
const groupBy = require('../utils/json')

class ProyectsRoutes {
  /**
   * Object for all the `proyects` routes
   * @param {DbService} dbService DbService class
   */
  constructor (dbService) {
    this.dbService = dbService
    this.router = express.Router()
    this.colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

    this.router.get('/', async (req, res, next) => {
      if (!req.query.page || req.query.page === '') req.query.page = 0
      res.render('proyects', await this.proyectsView(req.query.page))
    })

    this.router.post('/', async (req, res, next) => {
      if (!req.query.page || req.query.page === '') req.query.page = 0
      res.status(201).render('proyects', await this.proyectsView(req.query.page))
    })
  }

  async proyectsView (page) {
    const proyects = groupBy((await this.dbService.getProyects()).rows, 'id')
    const grouped = Object.keys(proyects).map(a => {
      const g = {
        id: parseInt(a),
        times: proyects[a],
        name: proyects[a][0].name,
        description: proyects[a][0].description,
        hours: proyects[a][0].proyect_hours
      }
      g.times = g.times.map(b => {
        b.color = this.colors[b.time_id]
        return b
      })
      return g
    })
    return {
      title: 'Timetracker - Proyects',
      owners: (await this.dbService.getOwners()).rows,
      proyects: grouped,
      page: page
    }
  }
}
module.exports = ProyectsRoutes
