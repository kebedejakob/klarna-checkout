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
app.use('/static', express.static('public'))
// app.enable('view cache'); enable  in prod

// Routes:
app.get('/', function (req, res, next) {
    const productID = 'ecom-viking'; //req.query.productID;
    const quantity = 1; //req.query.quantity;

    if (!productID || !quantity) {
        res.send('please put productID and quantity as query params in the URL');
        console.log('please put productID and quantity as query params in the URL');
        return;
    }

    // Create order and Render checkout
    const createOrderPromise = KlarnaService.createOrder(productID, quantity);
    createOrderPromise.then(response => {
        const klarnaCheckoutHTML = response.html_snippet;
        res.render('checkout', {
            layout: false,
            title: 'Betala med Klarna - EcomViking',
            klarna_checkout: klarnaCheckoutHTML
        });
    }).catch((err) => {
        console.error(err);
    });
});

app.get('/confirmation', function (req, res, next) {
    const order_id = req.query.order_id;

    // Get and Render order confirmation
    const readOrderPromise = KlarnaService.readOrder(order_id);
    readOrderPromise.then(response => {
        const {
            order_id,
            billing_address
        } = response;

        const klarnaSummaryHTML = response.html_snippet;
        const email = billing_address.email;
        const name = `${billing_address.given_name} ${billing_address.family_name}`
        const password = Math.random().toString(36).slice(-8); // randomize pass

        res.render('checkout', {
            layout: false,
            title: 'Order bekräftad! - EcomViking',
            klarna_summary: klarnaSummaryHTML,
            email: email,
            password: password,
        });

        // Capture order with Klarna
        const captureOrderPromise = KlarnaService.captureOrder(order_id, 'ECOM_VIKING_KLARNA', 1);
        captureOrderPromise.then(_ => {
            console.log(`Order ${order_id} Captured`);
        }).catch((err) => {
            console.error(err);
        });

    }).catch((err) => {
        console.error(err);
    });
});

app.get('/push', function (req, res, next) {
    const order_id = req.query.order_id;

    // Get and Render order confirmation
    const acknowledgeOrderPromise = KlarnaService.acknowledgeOrder(order_id);
    acknowledgeOrderPromise.then(_ => {
        console.log(`Order ${order_id} Acknowledged`);
    }).catch((err) => {
        console.error(err);
    });
});

//
app.listen(config.port, function () {
    console.log(`App listening on port ${config.port}`);
});