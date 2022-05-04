const express = require("express");
const path = require("path");

const route = express.Router();

route.use('/', express.static(path.join(__dirname, '../public_static')));

route.get('/', (req,res)=>{
    res.render('index', {message: req.flash('homePgSuccess')});
});

// Sub Routes
route.use('/', require('./user'));

//Resources
route.get('/resources', (req, res) => {
    res.render('resources', { user: req.user });
});

route.use('/upload', require('./upload'));
route.use('/query', require('./query'));
route.use('/queries', require('./queries'));
route.use('/users',require('./users'));
route.use('/api', require('./api'));
route.use('/pdfs', require('./pdfs'));
route.use('/feedback', require('./feedback'));

//Groups
route.use('/', require('./groups'));

//Tests
route.use('/', require('./tests'));

//Screen Sharing
route.use('/', require('./screenshare'));

//Attendance
route.use('/', require('./attendance'));

module.exports = route;