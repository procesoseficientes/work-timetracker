var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  res.render('track', {
    title: 'Timetracker',
    owners: [
      { id: 1, name: 'FERCO' },
      { id: 2, name: 'Arium' },
      { id: 3, name: 'Alza' },
      { id: 4, name: 'Cendalza' }
    ]
  })
})

router.post('/', (req, res, next) => {
  res.status(201).render('track', {
    title: 'Timetracker',
    owners: [
      { id: 1, name: 'FERCO' },
      { id: 2, name: 'Arium' },
      { id: 3, name: 'Alza' },
      { id: 4, name: 'Cendalza' }
    ]
  })
})

router.get('/detail', (req, res, next) => {
  res.render('detail', { title: 'Timetracker - Detail' })
})

router.get('/team', (req, res, next) => {
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

module.exports = router
