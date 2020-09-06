var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users', { title: 'Timetracker - Users' })
})

router.post('/', (req, res, next) => {
  console.log(req.body)
  res.status(201).render('users', { title: 'Timetracker - Users' })
})

module.exports = router
