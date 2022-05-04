const route = require("express").Router();

route.use("/students", require('./students'));
route.use('/', require('./test'));

module.exports = route;