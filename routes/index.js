const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/userController')

router.get('/', (req, res) => {
    res.send('Hello World!')
  })

// router halaman admin
router.get('/admin', Controller.homeAdmin)

// router untuk category
router.get('/admin/category', Controller.showCategories)
router.get('/admin/addCategory', Controller.renderAddCategory)
router.post('/admin/addCategory', Controller.handlerAddCategory)
router.get('/admin/:id/editCategory', Controller.renderEditCategory)
router.post('/admin/:id/editCategory', Controller.handlerEditCategory)
router.get('/admin/:id/deleteCategory', Controller.deleteCategory)

// router untuk product
router.get('/admin/product', Controller.showProducts)
router.get('/admin/addProduct', Controller.renderAddProduct)
router.post('/admin/addProduct', Controller.handlerAddProduct)
router.get('/admin/:id/editProduct', Controller.renderEditProduct)
router.post('/admin/:id/editProduct', Controller.handlerEditProduct)
router.get('/admin/:id/deleteProduct',Controller.deleteProduct)

// router untuk orderProduct
router.get('/admin/orderProduct', Controller.showOrderProduct)
router.get('/admin/addOrderProduct', Controller.renderAddOrderProduct)
router.post('/admin/addOrderProduct',Controller.handlerAddOrderProduct)

// router untuk Order
router.get('/admin/Order', Controller.showOrders)
router.get('/admin/:id/editOrder', Controller.renderEditOrder)
router.post('/admin/:id/editOrder', Controller.handlerEditOrder)
router.get('/admin/:id/deleteOrder',Controller.deleteOrder)

router.get('/register', UserController.readRegister)
router.post('/register', UserController.handleRegister)

router.get('/login', UserController.readLogin)
router.post('/login', UserController.handleLogin)

module.exports = router