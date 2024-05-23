const {Category,Product,OrderProduct,Order,Payment,User} = require('../models/index')
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

    static async renderAddCategory(req,res){
        try {
            let data = await Category.findAll()
            res.render('adminAddCategory', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerAddCategory(req,res){
        try {
            const {name} = req.body
            await Category.create({name})
            
            res.redirect("/admin/category")
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditCategory(req, res){
        try {
            const {id} = req.params
            const data = await Category.findByPk(id)

            res.render("adminEditCategory", {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditCategory(req, res){
        try {
            const {id} = req.params
            const {name} = req.body

            await Category.update({
                name:name
            },{
                where:{
                    id
                }
            })
            res.redirect('/admin/category')
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteCategory(req,res){
        try {
            let {id} = req.params
            await Category.destroy({
                where:{
                    id
                }
            })
            res.redirect('/admin/category')
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
            
            res.render("adminEditProduct" ,{data, category, id})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditProduct(req, res){
        try {
            const {name , description, price , stockQty , CategoryId , image } = req.body
            let {id} = req.params

             await Product.update({
                name:name,
                description:description,
                price:price,
                stockQty:stockQty,
                CategoryId:CategoryId,
                image:image
            },{
                where: {
                    id
                }
            })

            res.redirect(`/admin/product`)

        } catch (error) {
            res.send(error)
        }
    }

    static async deleteProduct(req, res){
        try {
            let {id} = req.params
            await Product.destroy({
                where:{
                    id
                }
            })
            res.redirect('/admin/product')
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk orderProduct : show , add , update, delete
    static async showOrderProduct(req, res){
        try {
            let data = await OrderProduct.findAll({
                include: [
                    {
                        model: Product,
                    },
                    {
                        model: Order,
                    }
                ]
            });
            // res.send(data);
            res.render('adminShowOrderProduct', {data, rupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async renderAddOrderProduct(req,res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerAddOrderProduct(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditOrderProduct(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditOrderProduct(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }


// controller untuk orders : show, edit , add, delete
    static async showOrders(req, res){
        try {
            let data = await Order.findAll({
                include: [
                    {
                        model: User,
                    },
                    {
                        model: OrderProduct,
                    }
                ]
            })
            
            // res.send(data)
            res.render('adminShowOrder', {data,rupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditOrder(req,res){
        try {
            const {id} = req.params
            const data = await Order.findByPk(id)

            res.render("adminEditOrder", {data,id})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditOrder(req,res){
        try {
            const {UserId,orderStatus,totalAmount} = req.body
            const {id} = req.params

            await Order.update({
                UserId:UserId,
                orderStatus:orderStatus,
                totalAmount:totalAmount
            },{
                where:{
                    id
                }
            })
            
            res.redirect('/admin/Order')
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