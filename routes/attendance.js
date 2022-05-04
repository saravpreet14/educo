const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

let mappedStudents = new Map([ ['0', 'Simarpreet'], ['1', 's2'], ['2', 's3'] ]);

route.get('/attendance', (req, res) => {
    models.User.find({ isStudent: 1 })
    .then(students => {
        res.render('attendance', students);
    })
    .catch(err => {
        console.log(err);
    })
})

route.post('/start', (req, res) => {
    console.log('Started Attendance');
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['face_rec/recognizer.py'], {shell: true})

    pyProg.stdout.on('data', (data) => {
        data = data.toString();
        data = data.slice(0, -1);
        data = data.split(';');

        let promises = [];
        data.forEach((student) => {
            let name = mappedStudents.get(student);
            promises.push(
                models.User.findOne({ name: name })
                .then(user => {
                    user.attendance += 1;
                    return user.save();
                }) 
                .then(user => {
                    console.log('User saved successfully');
                })
                .catch(err => {
                    console.log(err);
                })
            );
        })
        Promise.all(promises)
        .then(() => {
            console.log('All Students attendance updated successfully');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        })
    })

    pyProg.stderr.on('data', (err) => {
        console.log(`python ka error: ${err.toString()}`);
    })
})

module.exports = route;