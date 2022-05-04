const route = require('express').Router();
const models = require('../models');

route.get('/screen/:id', (req, res) => {
    models.Class.findById(req.params.id)
    .then((clas) => {
        res.render('screenshare', { screen: clas, user: req.user });
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    })
})

route.post('/screen', (req, res) => {
    console.log(req.user);
    models.Class.create({
        ...req.body,
        teacher: req.user._id,
        teacherName: req.user.name
    })
    .then((screen) => {
        console.log(screen);
        res.redirect('/screen/' + screen._id);
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
})

route.get('/screen', (req, res) => {
    res.render('createClass');
})

route.get('/screens', (req, res) => {
    models.Class.find()
    .then(classes => {
        res.render('classes', { classes: classes });
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    })
})

module.exports = route;