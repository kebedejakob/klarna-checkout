import KlarnaUIService from '../../services/server/KlarnaUIService';

const app = require('../../loaders/express-handlebars');

app.get('/', function (req, res, next) {
    const productID = req.query.productID;
    const quantity = req.query.quantity;
 
    if (!productID || !quantity) {
        res.send('please put productID and quantity as query params in the URL');
        console.log('please put productID and quantity as query params in the URL');
        return;
    }

    KlarnaUIService.renderKlarnaCheckout(res, productID, quantity);
});


module.exports = app