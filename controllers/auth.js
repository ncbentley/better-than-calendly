const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../models');

router.get('/login', (req, res) => {
    const context = {
        user: req.session.currentUser
    }
    res.render('auth/login', context);
});

router.post('/login', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username });
        if (!foundUser) {
            return res.send({message: 'Invalid Credentials'});
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) {
            return res.send({message: 'Invalid Credentials'});
        }
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username
        };
        res.redirect('/');
    } catch (error) {
        res.send({message: "Internal Server Error"});
        console.log(error);
    }
})

router.get('/register', (req, res) => {
    const context = {
        user: req.session.currentUser
    }
    res.render('auth/register', context);
})

router.post('/register', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({username: req.body.username});
        if (foundUser) {
            return res.send({message: 'Account is already registered'});
        }
        if (req.body.password !== req.body.confirm) {
            return res.send({message: 'Passwords do not match'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await db.User.create({
            username: req.body.username,
            password: hash
        });
        res.redirect('/login');
    } catch (error) {
        res.send({message: "Internal Server Error"});
        console.log(error);
    }
})

module.exports = router;