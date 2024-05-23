const { User } = require('../models')
const bcrypt = require('bcryptjs');

class UserController {
    static async home(req, res){
        try {
            let role = req.session.userRole
            if(!role) role = null
            res.render('index', {role, errors: null})
        } catch (error) {
            res.send(error)
        }
    }
    static async readRegister(req, res){
        try {
            let role = req.session.userRole
            if(!role) role = null
            res.render('./auth-pages/register', {role, errors: null})
        } catch (error) {
            res.send(error)
        }
    }
    static async handleRegister(req, res){
        try {
            let {fullName, phoneNumber, address, dateOfBirth, username, email, password, role} = req.body
            await User.create({fullName, phoneNumber, address, dateOfBirth, username, email, password, role})
            res.redirect('login')
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
                let errors = error.errors.map(el => el.message)
                res.render('./auth-pages/register', {errors, role: null})
            } else {
                res.send(error)
            }
        }
    }
    static async readLogin(req, res){
        try {
            let role = req.session.userRole
            if(role === undefined){
                role = null
            } 
            res.render('./auth-pages/login', {message: null, role})
        } catch (error) {
            res.send(error)
        }
    }
    static async handleLogin(req, res){
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: { email }})

            if(user && await bcrypt.compare(password, user.password)) {
                req.session.userId = user.id;
                req.session.userRole = user.role;
                if (user.role === 'admin') {
                    res.redirect('/admin');
                } else {
                    res.redirect('/shop');
                }
            } else {
                res.render('./auth-pages/login', { message: 'Invalid email or password', role: null });
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async logout(req, res){
        try {
            req.session.destroy(err => {
                if (err) {
                    res.send(err)
                } 
                res.redirect('login')
            })
        } catch (error) {
            res.send(error)
        }
    }
    // static async readRegister(req, res){
    //     try {
            
    //     } catch (error) {
    //         res.send(error)
    //     }
    // }
}

module.exports = UserController