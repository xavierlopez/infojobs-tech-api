const express = require('express');
const cors = require('cors');
const app = express();

// Config Express
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(cors());

app.use('/',require('./routes'));

module.exports = app;