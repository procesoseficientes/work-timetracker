var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('track', {
    owners: [
      { id: 1, name: 'FERCO' },
      { id: 2, name: 'Arium' },
      { id: 3, name: 'Alza' },
      { id: 4, name: 'Cendalza' },
      { id: 5, name: 'You (Break/Lunch)' }
    ]
  })
})

router.get('/team', (req, res, next) => {
  res.render('team', {})
})

router.get('/detail', (req, res, next) => {
  res.render('detail', {})
})

module.exports = router
