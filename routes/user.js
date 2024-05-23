const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', (req, res) => {
    res.redirect('/shop/products')
  })
router.get('/products', userController.showProducts)
router.get('/categories', userController.showCategories)
router.post('/products/add-to-cart', userController.addToCart);
router.get('/checkout', userController.showCheckoutForm);
router.post('/checkout', userController.processCheckout);
router.get('/category/:id', userController.showCategoriesById)
router.post('/checkout/increase/:ProductId', userController.increaseQuantity);
router.post('/checkout/decrease/:ProductId', userController.decreaseQuantity);
router.post('/checkout/remove/:ProductId', userController.removeItem);
router.get('/checkout/invoice/:orderId', userController.generateInvoice);
router.post('/checkout/confirm-payment/:orderId', userController.confirmPayment);

module.exports = router