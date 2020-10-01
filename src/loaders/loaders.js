import config from '../config';

const express = require('express');
const app = express();

app.use(require('./express-handlebars'));
app.use('/static', express.static('public'));
// Set caching and assets
if (config.node_env === 'production') {
    app.enable('view cache');
}


// Routes:
const index = require('../api/client/index');
const confirmation = require('../api/client/confirmation');
const push = require('../api/client/push');
const notFound = require('../api/both/404.js');
const serviceUnavailable = require('../api/both/500.js');
// Client Routes
app.use('/', index);
app.use('/confirmation', confirmation);
app.use('/push', push);

// Server Routes

// Error Pages:
app.use('/500', serviceUnavailable);
app.use('*', notFound); // Always keep as last route

app.listen(config.port, function () {
    console.log(`App listening on port ${config.port}`);
});

module.exports = app;