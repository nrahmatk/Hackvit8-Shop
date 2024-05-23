const {Category,Product,OrderItem,Order,Payment,User} = require('../models/index')
const {Op, where} = require('sequelize')
const rupiah = require('../helper/rupiah')

class Controller {
// controller untuk categori : show, add ,update, delete
    static async showCategories(req, res){
        try {
            let data = await Category.findAll()
            res.render('adminShowCategory' , {data})
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk product : show , add , update , delete
    static async showProducts(req, res){
        try {
            let data = await Product.findAll({
                include :Category
            })
            res.render('adminShowProduct', {data, rupiah})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async renderAddProduct(req, res){
        try {
            let data = await Category.findAll()
            res.render("adminAddProduct", {data})
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerAddProduct(req, res){
        try {
            const {name , description, price , stockQty , CategoryId , image } = req.body
            await Product.create({name , description, price , stockQty , CategoryId , image })

            res.redirect("/admin/product")
        } catch (error) {
            res.send(error)
        }
    }
    
    static async renderEditProduct(req, res){
        try {
            let {id} = req.params
            const category = await Category.findAll()
            const data = await Product.findByPk(id)
            
            console.log(data);
            
            res.render("adminEditProduct" ,{data, category, id})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditProduct(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteProduct(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk orderItem : show , add , update, delete
    static async showOrdersItem(req, res){
        try {
            let data = await OrderItem.findAll({
                include: Product,
                include: Order
            })
            res.render('adminShowOrderItem', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async showOrders(req, res){
        try {
            let data = await Order.findAll({
                include: User
            })
            res.render('adminShowOrder', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async showPayment(req,res){
        try {
            let data = await Payment.findAll({
                include:Order
            })
            res.render('adminShowPayment')
        } catch (error) {
            res.send(error)
        }
    }
    
}

module.exports = Controller