var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  const colors = ['bg-primary', 'bg-secondary', 'bg-danger', 'bg-warning', 'bg-info']
  res.render('proyects', {
    title: 'Timetracker - Proyects',
    owners: [
      { id: 1, name: 'FERCO' },
      { id: 2, name: 'Arium' },
      { id: 3, name: 'Alza' },
      { id: 4, name: 'Cendalza' }
    ],
    proyects: [
      {
        id: 1,
        name: 'Soporte Ferco',
        description: 'Proyecto sobre el soporte a FERCO',
        hours: 100,
        times: [
          {
            user: 'Fernando Rodrigez',
            color: colors[0],
            hours: 15,
            percent: (15 / 91) * 100
          },
          {
            user: 'Maria Rivera',
            color: colors[4],
            hours: 44,
            percent: (44 / 91) * 100
          },
          {
            user: 'Juana Gonzalez',
            color: colors[2],
            hours: 32,
            percent: (32 / 91) * 100
          }
        ]
      }
    ]
  })
})

module.exports = router
