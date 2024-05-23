const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/userController')

router.get('/', (req, res) => {
    res.send('Hello World!')
  })

// router untuk category
router.get('/admin/category', Controller.showCategories)

// router untuk product
router.get('/admin/product', Controller.showProducts)
router.get('/admin/addProduct', Controller.AddProduct)

router.get('/register', UserController.readRegister)
router.post('/register', UserController.handleRegister)

router.get('/login', UserController.readLogin)
router.post('/login', UserController.handleLogin)

module.exports = router