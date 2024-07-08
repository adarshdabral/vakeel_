const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { forwardAuthenticated } = require('../middleware/auth');

router.get('/', (req, res) => res.render('index'));

router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.post('/register', async(req, res) => {
    try {
        const { firstName, lastName, email, contact, password, isLawyer, consultingPrice, degree, pastCases, niches } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/register');
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            contact,
            password,
            isLawyer: isLawyer === 'on',
            consultingPrice,
            degree,
            pastCases,
            niches: niches ? (Array.isArray(niches) ? niches : [niches]) : []
        });

        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred during registration');
        res.redirect('/register');
    }
});

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.post('/login', async(req, res) => {
    try {
        const { emailOrContact, password } = req.body;
        const user = await User.findOne({ $or: [{ email: emailOrContact }, { contact: emailOrContact }] });

        if (!user) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/login');
        }

        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred during login');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/login');
    });
});

module.exports = router;