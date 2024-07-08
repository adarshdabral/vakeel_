const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const config = require('./config/database');
const serverless = require('serverless-http');
const app = express();

// Connect to MongoDB
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS
app.set('view engine', 'ejs');

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/.netlify/functions/app', require('./routes/auth'));
app.use('/.netlify/functions/app/dashboard', require('./routes/dashboard'));
app.use('/.netlify/functions/app/issues', require('./routes/issues'));

// Default route for checking if the app is running
app.get('/.netlify/functions/app', (req, res) => {
    res.send('App is running..');
});

module.exports.handler = serverless(app);

// Local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
