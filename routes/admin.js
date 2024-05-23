const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/', (req, res) => {
    res.redirect('/admin/products')
  })

// router untuk category
router.get('/categories', adminController.showCategories)
router.get('/addCategory', adminController.renderAddCategory)
router.post('/addCategory', adminController.handlerAddCategory)
router.get('/:id/editCategory', adminController.renderEditCategory)
router.post('/:id/editCategory', adminController.handlerEditCategory)
router.get('/:id/deleteCategory', adminController.deleteCategory)

// router untuk product
router.get('/products', adminController.showProducts)
router.get('/addProduct', adminController.renderAddProduct)
router.post('/addProduct', adminController.handlerAddProduct)
router.get('/:id/editProduct', adminController.renderEditProduct)
router.post('/:id/editProduct', adminController.handlerEditProduct)
router.get('/:id/deleteProduct', adminController.deleteProduct)

module.exports = router