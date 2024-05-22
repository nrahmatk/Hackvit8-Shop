const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/userController')

router.get('/', (req, res) => {
    res.send('Hello World!')
  })


router.get('/register', UserController.readRegister)
router.post('/register', UserController.handleRegister)

router.get('/login', UserController.readLogin)
router.post('/login', UserController.handleLogin)

module.exports = router