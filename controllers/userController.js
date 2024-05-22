const {User} = require('../models')
const bcrypt = require('bcryptjs');

class UserController {
    static async readRegister(req, res){
        try {
            res.render('register')
        } catch (error) {
            res.send(error)
        }
    }
    static async handleRegister(req, res){
        try {
            let {username, email, password, role} = req.body
            await User.create({username, email, password, role})
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
    static async readLogin(req, res){
        try {
            res.render('login')
        } catch (error) {
            res.send(error)
        }
    }
    static async handleLogin(req, res){
        try {
            let {email, password} = req.body
            const check = await User.findOne({where: { email }})
            if(check) {
                const check2 = await bcrypt.compare(password, check.password)
                if(check2) {
                    res.redirect('/')
                } else {
                    res.redirect('/login?error=email')
                }
            }
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