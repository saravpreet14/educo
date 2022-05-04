const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
})

route.post('/uploadFile', (req, res) => {
    console.log('KARNA HAI UPLOAD FILE WALA KAAM');
    res.redirect('/home');
})

route.post('/dashboard', (req, res) => {
    const newGroup = new models.Group(); 
    newGroup.name = req.body.group;
    newGroup.groupType = req.body.gtype;
    newGroup.image = req.body.upload;
    newGroup.createdBy = req.user.name;
    newGroup.save((err) => {
        res.render('admin/dashboard');
    })
})

route.get('/home', (req, res) => {
    models.Group.find()
    .then(results => {
        // const dataChunk  = [];
        // const chunkSize = 3;
        // for (let i = 0; i < results.length; i += chunkSize){
        //     dataChunk.push(results.slice(i, i+chunkSize));
        // }
        // res.render('home', {title: 'Invictus - Home', user: req.user, chunks: dataChunk})
        res.render('home2', { user: req.user, groups: results });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    })
})

route.get('/group/:name/:channel', (req, res) => {
    const name = req.params.name;
    const channel = Number(req.params.channel);
    
    models.GroupMessage.find({index: channel})
    .populate('sender')
    .then(results => {
        res.render('groupChat/group', {title: 'Invictus | Group', user:req.user, groupName:name, groupMsg: results, channel: channel});
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    }) 
})

route.post('/group/:name', (req, res) => {
    if(req.body.message){
        const group = new models.GroupMessage();
        group.sender = req.user._id;
        group.body = req.body.message;
        group.name = req.body.groupName;
        group.index = req.body.channelForm;
        group.createdAt = new Date();

        group.save()
        .then(msg => {
            console.log("Saved");
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        })
    }
    res.redirect('/group/'+req.params.name);
})

module.exports = route;
