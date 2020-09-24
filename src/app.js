import config from './config';

import KlarnaService from './services/KlarnaService';
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const hbs = exphbs.create({
    /* config */
    defaultLayout: false,
});

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');
// app.enable('view cache'); enable  in prod

// Routes:
app.get('/', function (req, res, next) {
    const productID = req.query.productID;
    const quantity = req.query.quantity;

    const createOrderPromise = KlarnaService.createOrder();
    createOrderPromise.then(response => {
        const klarnaCheckoutHTML = response.html_snippet;
        res.render('checkout', {
            layout: false,
            klarna_checkout: klarnaCheckoutHTML
        });

    }).catch((err) => {
        console.error(err);
    });
});

app.get('/confirmation', function (req, res, next) {
    const order_id = req.query.order_id;
    const readOrderPromise = KlarnaService.readOrder(order_id);
    readOrderPromise.then(response => {
        const klarnaSummaryHTML = response.html_snippet;
        console.log(klarnaSummaryHTML);
        res.render('checkout', {
            layout: false,
            klarna_summary: klarnaSummaryHTML
        });

    }).catch((err) => {
        console.error(err);
    });
});

//
app.listen(config.port, function () {
    console.log(`App listening on port ${config.port}`);
});