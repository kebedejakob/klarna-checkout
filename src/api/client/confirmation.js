import KlarnaAPIService from '../../services/server/KlarnaAPIService';
import KlarnaUIService from '../../services/server/KlarnaUIService';

const app = require('../../loaders/express-handlebars');

app.get('/confirmation', function (req, res, next) {
    const order_id = req.query.order_id;
    const callback = (klarna_payment_confirmed_response) => {
        const order_id = klarna_payment_confirmed_response.order_id;
        const productReference = klarna_payment_confirmed_response.order_lines[0].reference;
        const quantity = klarna_payment_confirmed_response.order_lines[0].quantity;
        KlarnaAPIService.captureOrder(order_id, productReference, quantity).then(res => {
            console.log(`Order ${order_id} Captured`);
        }).catch((err) => {
            console.log(`Failed to Capture Order with ID: ${order_id} due to ${err} (Order is probably already captured)`);
        })
    }
    KlarnaUIService.renderKlarnaPaymentConfirmation(res, order_id, callback);
});

module.exports = app;