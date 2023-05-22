const express = require('express');
const cors = require('cors');
const app = express();
const cron = require('node-cron');


// Config Express
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(cors());
app.use('/',require('./routes'));

//initializing cron jobs
require('./cronJobs');

module.exports = app;