const express = require('express')
const router = express.Router()
const Controller = require('../controllers/userController')

router.get('/', (req, res) => {
    res.send('Hello User!')
  })

module.exports = router