const express = require('express')
const router = express.Router()
const Controller = require('../controllers/adminController')

router.get('/', (req, res) => {
    res.send(req.session)
  })

module.exports = router