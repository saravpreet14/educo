const route = require('express').Router();
const models = require('../../models');
const auth = require('../../utils/auth');

route.post('/updatePerformance/:id', (req, res) => {
    console.log("Hello");
    models.User.findById(req.params.id)
    .then(user => {
        console.log(req.body);
        user.testsGiven.push(req.body);
        return user.save();
    })
    .then(user => {
        res.send(user);
    })
    .catch(err => {
        console.log(err);
        console.log("Error in api test");
        res.send(err);
    })
})

module.exports = route;