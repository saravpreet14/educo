const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const alert = require('alert-node');

route.get('/createTest', (req, res) => {
    res.render('test/createTest', {user: req.user});
})

route.post('/test', (req, res) => {
    const test = new models.Test(); 
    test.name = req.body.name;
    test.subject = req.body.subject;
    test.createdBy = req.user.name;
    test.content = req.body.content;
    test.startingTime = req.body.startingTime;
    test.endingTime = req.body.endingTime;

    console.log("Test ");
    console.log(test);

    test.save()
    .then(test => {
        res.send('/test/' + test._id + '/');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    })
})

route.get('/test/:id', (req, res) => {
    models.Test.findById(req.params.id)
    .then(test => {
        if(Date.now() < test.startingTime) {
            alert('Test has not started yet! Try again after sometime');
            res.redirect('back');
        }
        else if(Date.now() > test.endingTime) {
            console.log("Test khatam")
            alert('Test has ended! Check your profile to see results');
            res.redirect('back');
        }
        else {
            res.render('test/giveTest', {test: test, user: req.user});
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    })
})

route.get('/tests', (req, res) => {
    models.Test.find()
    .then(tests => {
        res.render('test/tests', { tests: tests, user: req.user });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    })
})

module.exports = route;