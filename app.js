const express = require('express');
const cors = require('cors');
const app = express();
const cron = require('node-cron');


// Config Express
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(cors());
app.use('/docs', express.static('docs'));
app.use('/',require('./routes'));

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//initializing cron jobs
const job = require('./cronJobs');

module.exports = app;
module.exports.feedingJob = job;