const express = require('express')
const router = express.Router()
const UserController = require('../controllers/authController')
const {redirectLogin, redirectAdmin, redirectUser} = require('../middleware/authMiddleware')
const adminRouter = require('./admin')
const userRouter = require('./user')

router.get('/', UserController.home)

router.get('/register', UserController.readRegister)
router.post('/register', UserController.handleRegister)

router.get('/login', UserController.readLogin)
router.post('/login', UserController.handleLogin)

router.use('/admin', redirectLogin, redirectAdmin, adminRouter)
router.use('/shop', redirectLogin, redirectUser, userRouter)


router.get('/logout', UserController.logout)


module.exports = router


