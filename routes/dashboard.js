const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        if (req.session.user.isLawyer) {
            const issues = await Issue.find({ niche: { $in: req.session.user.niches } }).populate('user', 'firstName lastName email');
            res.render('dashboard-lawyer', { issues });
        } else {
            res.render('dashboard-client');
        }
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred while loading the dashboard');
        res.redirect('/');
    }
});

router.get('/search-lawyers', ensureAuthenticated, async(req, res) => {
    try {
        const { niche } = req.query;
        const lawyers = await User.find({ isLawyer: true, niches: niche }).select('-password');
        res.json(lawyers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for lawyers' });
    }
});

module.exports = router;