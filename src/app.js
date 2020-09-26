import config from './config';

import KlarnaService from './services/KlarnaService';
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

const hbs = exphbs.create({
    /* config */
    defaultLayout: false,
});

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// app.enable('view cache'); enable  in prod

// Routes:
app.get('/', function (req, res, next) {
    const productID = req.query.productID;
    const quantity = req.query.quantity;

    if (!productID || !quantity) {
        res.send('please put productID and quantity as query params in the URL');
        console.log('please put productID and quantity as query params in the URL');
        return;
    }

    const createOrderPromise = KlarnaService.createOrder(productID, quantity);
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
        res.render('checkout', {
            layout: false,
            klarna_summary: klarnaSummaryHTML,
        });
        console.log("rendered");
    }).catch((err) => {
        console.error(err);
    });
});

//
app.listen(config.port, function () {
    console.log(`App listening on port ${config.port}`);
});