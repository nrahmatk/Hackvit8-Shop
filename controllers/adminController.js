const {Category,Product,OrderItem,Order,Payment,User} = require('../models/index')
const {Op} = require('sequelize')
const rupiah = require('../helper/rupiah')

class adminController {
// controller untuk categori : show, add ,update, delete
    static async showCategories(req, res){
        try {
            const role = req.session.userRole
            let data = await Category.findAll()
            res.render('./admin/showCategories' , {role, data})
        } catch (error) {
            res.send(error)
        }
    }

    static async renderAddCategory(req,res){
        try {
            const role = req.session.userRole
            let data = await Category.findAll()
            res.render('./admin/addCategory', {role, data})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerAddCategory(req,res){
        try {
            const {name} = req.body
            await Category.create({name})
            
            res.redirect("/admin/categories")
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditCategory(req, res){
        try {
            const role = req.session.userRole
            const {id} = req.params
            const data = await Category.findByPk(id)

            res.render("./admin/editCategory", {role, data})
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
            res.redirect('/admin/categories')
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
            res.redirect('/admin/categories')
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk product : show , add , update , delete
    static async showProducts(req, res){
        try {
            const role = req.session.userRole
            let data = await Product.findAll({
                include :Category
            })
            res.render('./admin/showProducts', {role, data, rupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async renderAddProduct(req, res){
        try {
            const role = req.session.userRole
            let data = await Category.findAll()
            res.render("./admin/addProduct", {role, data})
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerAddProduct(req, res){
        try {
            const {name , description, price , stockQty , CategoryId , image } = req.body
            await Product.create({name , description, price , stockQty , CategoryId , image })

            res.redirect("/admin/products")
        } catch (error) {
            res.send(error)
        }
    }
    
    static async renderEditProduct(req, res){
        try {
            const role = req.session.userRole
            let {id} = req.params
            const category = await Category.findAll()
            const data = await Product.findByPk(id)
            
            res.render("./admin/editProduct", {role, data, category, id})
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

            res.redirect(`/admin/products`)

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
            res.redirect('/admin/products')
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk orderItem : show , add , update, delete

    static async showPayment(req,res){
        try {
            let data = await Payment.findAll({
                include:Order
            })
            res.render('./admin/showPayment')
        } catch (error) {
            res.send(error)
        }
    }

    // controller untuk orders : show, edit , add, delete
    static async showOrders(req, res){
        try {
            const role = req.session.userRole
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
            
            res.render('./admin/showOrder', {data,rupiah, role})
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditOrder(req,res){
        try {
            const {id} = req.params
            const data = await Order.findByPk(id)

            res.render("./admin/showOrder", {data,id})
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
            
            res.redirect('/admin/order')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = adminController