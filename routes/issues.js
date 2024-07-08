const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/create', ensureAuthenticated, async(req, res) => {
    try {
        const { description, niche } = req.body;
        const newIssue = new Issue({
            user: req.session.user._id,
            description,
            niche
        });
        await newIssue.save();
        req.flash('success_msg', 'Issue posted successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred while posting the issue');
        res.redirect('/dashboard');
    }
});

module.exports = router;