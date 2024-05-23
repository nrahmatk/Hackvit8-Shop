const {Category,Product,OrderProduct,Order,Payment,User} = require('../models/index')
const { Op } = require("sequelize");
const rupiah = require('../helper/rupiah')
const PDFDocument = require('pdfkit');

class userController {
// controller untuk categori : show, add ,update, delete
    static async showCategories(req, res){
        try {
            const role = req.session.userRole
            let data = await Category.findAll()
            res.render('./user/categories' , {data, role})
        } catch (error) {
            res.send(error)
        }
    }

// controller untuk product : show , add , update , delete
    static async showProducts(req, res){
        try {
            const role = req.session.userRole
            let {search} = req.query

            let options = {
                where: {},
                include: Category,
            }


            if(search){
                options.where.name = {[Op.iLike]: `%${search}%`}
            }

            let {dataValues} = await Product.notif()
            
            let data = await Product.findAll(options)


            // res.send(data)

            res.render('./user/products', {data, rupiah, role, dataValues})
        } catch (error) {
            res.send(error)
        }
    }
    static async showCategoriesById(req, res){
        try {
            const {id} = req.params
            const role = req.session.userRole
            let data = await Product.findAll({
                where: {
                    CategoryId: id,
                },
                include :Category
            })
            res.render('./user/categoriesbyid', {data, rupiah, role})
        } catch (error) {
            res.send(error)
        }
    }

    static async addToCart(req, res) {
        const { ProductId, quantity } = req.body;
        const UserId = req.session.userId;

        try {
            // Temukan atau buat order aktif untuk user
            let order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });
            if (!order) {
                order = await Order.create({ UserId, orderStatus: 'active' });
            }

            // Temukan atau buat item di order
            let orderItem = await OrderProduct.findOne({ where: { ProductId, OrderId: order.id } });
            if (orderItem) {
                orderItem.quantity += parseInt(quantity, 10);
                await orderItem.save();
            } else {
                const product = await Product.findByPk(ProductId);
                orderItem = await OrderProduct.create({
                    ProductId,
                    OrderId: order.id,
                    quantity: parseInt(quantity, 10),
                    price: product.price
                });
            }

            // Hitung total amount
            const orderItems = await OrderProduct.findAll({ where: { OrderId: order.id }});
            const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

            // Perbarui total amount di order
            order.totalAmount = totalAmount;
            await order.save();

            res.redirect('/shop');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async showCheckoutForm(req, res) {
        const UserId = req.session.userId
        const role = req.session.userRole

        try {
            const order = await Order.findOne({
                where: { UserId, orderStatus: 'active' },
                include: [
                    {
                        model: OrderProduct,
                        include: [Product]
                    }
                ],
            },
            );

            if (!order) {
                return res.render('./user/checkout', { items: [], total: 0, role});
            }

            const items = order.OrderProducts;
            const total = order.totalAmount;

            res.render('./user/checkout', { items, total, role, rupiah });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async increaseQuantity(req, res) {
        const { ProductId } = req.params;
        const UserId = req.session.userId;

        try {
            const order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });
            if (!order) {
                return res.redirect('/shop');
            }

            const orderItem = await OrderProduct.findOne({ where: { OrderId: order.id, ProductId } });
            if (orderItem) {
                orderItem.quantity += 1;
                await orderItem.save();
            }

            const orderItems = await OrderProduct.findAll({ where: { OrderId: order.id } });
            const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            order.totalAmount = totalAmount;
            await order.save();

            res.redirect('/shop/checkout');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async decreaseQuantity(req, res) {
        const { ProductId } = req.params;
        const UserId = req.session.userId;

        try {
            const order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });
            if (!order) {
                return res.redirect('/shop');
            }

            const orderItem = await OrderProduct.findOne({ where: { OrderId: order.id, ProductId } });
            if (orderItem && orderItem.quantity > 1) {
                orderItem.quantity -= 1;
                await orderItem.save();
            } else if (orderItem && orderItem.quantity === 1) {
                await orderItem.destroy();
            }

            const orderItems = await OrderProduct.findAll({ where: { OrderId: order.id } });
            const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            order.totalAmount = totalAmount;
            await order.save();

            res.redirect('/shop/checkout');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async removeItem(req, res) {
        
        try {
            const { ProductId } = req.params;
            const UserId = req.session.userId;
            const order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });
            if (!order) {
                return res.redirect('/shop');
            }

            const orderItem = await OrderProduct.findOne({ where: { OrderId: order.id, ProductId } });
            if (orderItem) {
                await orderItem.destroy();
            }

            const orderItems = await OrderProduct.findAll({ where: { OrderId: order.id } });
            const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            order.totalAmount = totalAmount;
            await order.save();

            res.redirect('/shop/checkout');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // static async processCheckout(req, res) {
    //     const UserId = req.session.userId;

    //     try {
    //         const order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });

    //         if (!order) {
    //             return res.status(404).json({ message: 'Order not found' });
    //         }

    //         const { paymentAmount } = req.body;

    //         // Buat pembayaran
    //         const payment = await Payment.create({
    //             OrderId: order.id,
    //             paymentStatus: 'paid',
    //             paymentAmount: parseFloat(paymentAmount),
    //             paymentDate: new Date()
    //         });

    //         // Perbarui status pesanan
    //         order.orderStatus = 'completed';
    //         await order.save();

    //         res.redirect('/shop/checkout/success');
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

    static async processCheckout(req, res) {
        const UserId = req.session.userId;
        const role = req.session.userRole

        try {
            const order = await Order.findOne({ where: { UserId, orderStatus: 'active' } });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const { paymentAmount } = req.body;

            // Redirect to payment page
            res.render('./user/payment', { order, role });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async confirmPayment(req, res) {
        const { orderId } = req.params;
        const UserId = req.session.userId;

        try {
            const order = await Order.findOne({ where: { id: orderId, UserId } });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Update order status to paid
            order.orderStatus = 'paid';
            await order.save();

            // Create payment record
            await Payment.create({
                OrderId: order.id,
                paymentStatus: 'paid',
                paymentAmount: order.totalAmount,
                paymentDate: new Date()
            });

            // Redirect to generate invoice
            res.redirect(`/shop/checkout/invoice/${order.id}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async generateInvoice(req, res) {
        const orderId = req.params.orderId;

        try {
            const order = await Order.findOne({
                where: { id: orderId },
                include: [
                    {
                        model: OrderProduct,
                        include: [Product]
                    },
                    { model: Payment }
                ]
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const doc = new PDFDocument();
            let filename = `Invoice-${order.id}.pdf`;
            filename = encodeURIComponent(filename);
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-type', 'application/pdf');
            
            doc.text(`Hackvit8 Shop`, { align: 'center'});
            doc.text(`\n\nInvoice for Order ${order.id}`, { align: 'center' });
            doc.text(`Payment Date: ${order.Payment.formateddate}`, { align: 'center' });
            doc.text(`Total Amount: ${rupiah(order.totalAmount)}`, { align: 'center' });

            doc.text(`\n\nProducts:`, { align: 'left' });
            order.OrderProducts.forEach(item => {
                doc.text(`- ${item.Product.name}: ${item.quantity} x ${rupiah(item.price)} = ${rupiah(item.quantity * item.price)}`);
            });

            doc.text(`\n\n\n\nTerima kasih telah belanja di Hackvit8 Shop`, { align: 'center' });

            doc.end();
            doc.pipe(res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = userController