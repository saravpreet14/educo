const express       =   require('express');
const bodyParser    =   require('body-parser');
const ejs           =   require('ejs');
const cookieParser  =   require('cookie-parser');
const session       =   require('express-session');
const flash         =   require('express-flash');
const MongoStore    =   require('connect-mongo')(session);
const socketIO      =   require('socket.io');
const path          =   require('path');
const http          =   require('http');
const _             =   require('lodash');
const { Users }     =   require('./utils/usersClass');
const queryProcess  =   require('./utils/query');
const passport      =   require('./passport');
const db            =   require('./db');
const models        =   require('./models');
const CONFIG        =   require('./config2');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const updateTime = 25000
const setIntervalTime = 10000

app.use(express.static(path.join(__dirname, 'public_static')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set('view engine', 'ejs');

app.use(flash());
app.use(cookieParser(CONFIG.COOKIE_SECRET_KEY));
app.use(session({
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
app.locals._ = _;

app.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
});

require('./socket/groupChat')(io, Users);
require('./socket/screenshare')(io, Users);
app.use('/', require('./routes'));

// setInterval(() => {
//     models.Query.find({ lastUpdated: { $lte: Date.now() - updateTime } })
//     .then((queries) => {
//         console.log(Date.now())
//         console.log(`number of queries to be done now: ${queries.length}`)
//         console.log(queries.length);
//         queries.forEach(query => {
//             console.log(`in set interval for query: ${query.keywords}`)
//             queryProcess(query)
//             .then(text => {
//                 console.log(text);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         })
//     })
//     .catch(err => {
//         console.log("Error in query finding");
//         console.log(err);
//     })
// }, Number(setIntervalTime));

app.get('*', (req, res) => {
    res.redirect('/');
})

server.listen(process.env.PORT || CONFIG.SERVER.PORT, ()=>{
    console.log(`Server Started at http://localhost:${CONFIG.SERVER.PORT}/`);
})