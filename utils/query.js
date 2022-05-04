const trieFuntions = require('../utils/trieFunctions')
const models = require('../models');
const nodemailer = require('nodemailer');
const config = require('../config2');

const confidence = (trie,keywords) => {
    //console.log('in confidence')
    //console.log(keywords)
    //console.log(typeof keywords)
    matched = 0
    total = 0
    //if(keywords.)
    keyStrings = keywords.split(',')
    keyStrings.forEach(string => {
        total++
        if(string[0]==' ')
            string = string.substr(1)
        if(string.indexOf(' ')!=-1){
            f=1
            //console.log('multiple words')
            words = string.split(' ')
            words.forEach(word=> {
                //console.log(`${word} = ${word.length}`)
                if(trieFuntions.isWord(trie.root,word)){
                    //console.log('found')
                }
                else{
                    f=0
                    //console.log('not found')
                }
            })
            if(f==1){
                //console.log('matched')
                matched++
            }
            else{
                //console.log('not matched')
            }
        }
        else{
            //console.log(`single: ${string}`)
            if (trieFuntions.isWord(trie.root,string)){
                matched++
                //console.log('matched')
            }
            else{
                //console.log('not matched')
            }
        }
    })
    
    let confi = (matched*1.0)/(total)
    return confi
}

const textMessage = (query) => {
    return new Promise ((resolve, reject)=>{
        models.User
        .findById(query.user)
        .then(user=> {
            const { spawn } = require('child_process');
            phoneNo = user.phoneNo
            const pyProg = spawn('python3', ['public_static/python/msg.py', phoneNo]);  
            pyProg.stdout.on('data', (data) => {
                data = data.toString();
                console.log('yaha text msg')
                console.log(data)
                resolve();
            });
        
            pyProg.stderr.on('data', (err) => {
                console.log('error in text msg')
                console.log(err.toString());
                reject(err);
            })
        })
        .catch(err=> {
            console.log(err)
            reject(err)
        })
    })
}

const queryProcess = (query) => {
    return new Promise((resolve, reject)=>{
        models.Pdf.find()
        .skip(query.pdfsProcessed)
        .then(pdfs => {
            keywords = query.processedKeywords
            threshold = 0.75 // 4/6
            text = ''   //text to be emailed
            names = ''  //names of all pdfs, only for debugging
            pdfs.forEach(pdf =>{
                console.log(`pdf name= ${pdf.name}`)
                score = confidence(pdf.trie,keywords)
                console.log(score);
                if (score > threshold){
                    console.log('found pdf')
                    text = text + '\n' + pdf.pdfUrl
                    names = names + ' ' + pdf.name
                }
                else console.log('not found pdf')
            })
            query.pdfsProcessed += pdfs.length 
            query.lastUpdated = Date.now()
            
            if(text.length == 0) {
                text = "No new Relevant resources were added during last 3 Months"
            }

            if(query.clinicalResult.indexOf(' '!=-1))
                finalResult = query.clinicalResult.replace(' ', '\n')
    
            string = 'Here are the results to your query.\n' +
            `Keywords: ${query.keywords}\n`

            string += `Following are the relevant article from ClinicalKey Website: \n` 
            if(query.timesProcessed == 0)
                string += finalResult + `\n`
            else string+= 'No new result'
            
            string+='Following are the relevant articles extracted from Local Database: \n' + text
        
            query.localResult += text
            query.timesProcessed +=1
            console.log('main answer')
            console.log(query.pdfsProcessed)
            console.log(names)
            query.save()
            .then(q => {
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: config.MAILER.EMAIL,
                        pass: config.MAILER.PASSWORD
                    }
                });

                const mailOptions = {
                    to: q.email,
                    from: config.MAILER.EMAIL,
                    subject: 'Eureka: Results to your Query',
                    text: string
                };

                transporter.sendMail(mailOptions)
                .then(()=>{
                    console.log('Mail Sent!');
                    resolve(text);
                })
                // .then(()=>{
                //     console.log('time to text')
                //     return textMessage(query)
                // })
                .catch(err => {
                    console.log(err);
                    console.log("Mail not sent");
                })
            })
            .catch(err => {
                console.log(err);
                console.log("Error in  Q saving");
            })
        })
        .catch(err => {
            console.log(`error: ${err}`)
            reject(err);
        })
    })
}

module.exports = queryProcess;