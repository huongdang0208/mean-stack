const express = require('express');
const route = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const config = require('../config/database')

// /users/register
route.post('/register', (req, res, next) => {
    let newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    
    User.addNewUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg: 'failed to registered'})
        } else {
            res.json({success: true, msg: 'registered successfully'})
        }
    });
})

// users authenticate
route.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        // if user did not found or doesn't match with any username
        if(!user) {
            return res.json({success: false, msg: 'user not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                // generate token if user is matched
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 608000 // user need to log in after 1 week
                });
                res.json({
                    success: true,
                    token: 'jwt' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'wrong password'})
            }
        })
    })
})

// users profile
route.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user})
})

// users validate
route.get('/validate', (req, res, next) => {
    res.send('validate')
})

//export module
module.exports = route;