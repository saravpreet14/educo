const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const queryProcess = require('../utils/query');

const processKeywords = (keywords)=> {
    return new Promise((resolve,reject)=>{
        const { spawn } = require('child_process')
        const pyProg = spawn('python3', ['public_static/python/processing.py', keywords], {shell: true})
        pyProg.stdout.on('data', (data) => {
            data = data.toString()
            console.log(data);
            data = data.slice(0, -2) // contains three extra characters at end- ' ', '\r', '\n'
            console.log('inside processKeywords: ')
            console.log(data)
            resolve(data);
        });
    
        pyProg.stderr.on('data', (err) => {
            console.log(`python ka error: ${err}`)
            reject(err);
        })
    })
}

const clinicalKeyOutput = (text) => {
    return new Promise((resolve,reject)=>{
        console.log(`inside: ${text}`)
        const { spawn } = require('child_process');
        const pyProg = spawn('python3', ['public_static/python/clinicalKey.py', text]);  
        pyProg.stdout.on('data', (data) => {
            data = data.toString();
            resolve(data);
        });
    
        // pyProg.stderr.on('data', (err) => {
        //     console.log('error in clinical key')
        //     console.log(err.toString());
        //     reject(err);
        // })
        resolve(' this is text')
    })
}

const userSave = (mail, query) => {
    console.log(mail);
    return new Promise((resolve, reject) => {
        models.User.findOne({ email: mail })
        .then(student => {
            student.pastQueries.push(query);
            return student.save();
        })
        .then(student => {
            console.log("Successfully Saved student");
            console.log(student);
            resolve(student);
        })
        .catch(err => {
            console.log("Error in student updating");
            console.log(err);
            reject(err);
        });
    })
}

route.get('/', auth.isLoggedIn, (req,res)=>{
    res.render('query');
})

route.get('/:id', auth.isLoggedIn, (req, res) => {
    models.Query.findById(req.params.id)
    .populate('students')
    .populate('mentor')
    .then(query => {
        console.log(query);
        res.render('queryView', { query });
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    }) 
})

route.post('/', auth.isLoggedIn, (req,res)=>{
    text = req.body.keywords.split(',')
    originalKeywords = req.body.keywords
    console.log('Original')
    console.log(text)
    id = req.user.id
    body = req.body
    user = req.user
    clinicalKeyOutput(text)
    .then(result => {
        processKeywords(text)
        .then((keywords) => {
            console.log('Keywords aagye');
            console.log(keywords)
            let query = new models.Query()
            let emails = []
            emails.push(user.email);
            let studentsData = body.studentEmail
            studentsData.forEach(studentData => {
                studentData = studentData.split(';');
                emails.push(studentData[0]);
                query.students.push(studentData[1]);
                query.phoneNos.push(studentData[2]);
            }) 
            query.email = emails

            query.clinicalResult = result
            query.keywords = originalKeywords
            query.processedKeywords = keywords
            console.log(`Keywords outside: ${keywords}`)
            query.user = id
            query.dateUploaded = Date.now()
            
            query.save()
            .then(query => {
                return queryProcess(query);
            })
            .then(text => {
                console.log('Yaha bhi aa rha h');
                console.log(`email: ${text}`)
                return models.User.findById(id);
            })
            .then(user=> {
                user.pastQueries.push(query);
                return user.save();
            })
            .then(user=>{
                console.log("Saved user");
                let promises = [];

                for(let i=0 ; i<studentsData.length ; i++) {
                    console.log(studentsData[i].split(';')[0]);
                    promises.push(userSave(studentsData[i].split(';')[0], query));
                }
                console.log("pakk")
                return Promise.all(promises);
            })
            .then(() => {
                //req.flash('homePgSuccess', 'Successfully submitted the query.');
            })
            .catch(err => {
                console.log("Error in query saving");
            })
        })
        .catch(err => {
            //return res.redirect('/');   
        })
    })
    .catch(err=> {
        console.log(`err in outermost query level: ${err}`)
        //return res.redirect('/')
    })
    res.redirect('/');
});


module.exports = route;
