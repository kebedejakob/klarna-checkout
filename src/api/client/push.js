import KlarnaAPIService from '../../services/server/KlarnaAPIService';

const express = require('express');
const app = express.Router();

app.get('/push', function (req, res, next) {
    const order_id = req.query.order_id;

    // Get and Render order confirmation
    const acknowledgeOrderPromise = KlarnaAPIService.acknowledgeOrder(order_id);
    acknowledgeOrderPromise.then(_ => {
        console.log(`Order ${order_id} Acknowledged`);
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = app;