import config from '../config';
import RESTService from './RESTService';

class KlarnaService {

    static getKlarnaAuth() {
        const username = config.klarna.publicKey;
        const password = config.klarna.secretKey;
        const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        return auth;
    }

    static getKlarnaRequestOptions() {
        return {
            host: config.klarna.baseUrl,
            port: 443, // default 443 for HTTP
            path: '', // e.g. '/checkout/v3/orders', usually set in a method
            method: '', // 'GET', 'POST', usually set in a method
            body: '', // {} JSON raw mostly, usually set in a method
            headers: {
                'Content-Type': 'application/json', // default is JSON
                'Authorization': this.getKlarnaAuth()
            },
        };
    }

    static createOrder(productId, quantity) {
        const requestOptions = this.getKlarnaRequestOptions();
        requestOptions.path = '/checkout/v3/orders';
        requestOptions.method = 'POST';
        const orderBody = this.getProductDetails(productId, quantity);
        requestOptions.body = orderBody;

        return new Promise((resolve, reject) => {
            RESTService.getJSON(requestOptions, (resCode, obj) => {
                if (resCode === 201) {
                    resolve(obj)
                } else {
                    reject(obj);
                }
            });;
        })
    }

    static readOrder(order_id) {
        const requestOptions = this.getKlarnaRequestOptions();
        requestOptions.path = `/checkout/v3/orders/${order_id}`;
        requestOptions.method = 'GET';

        return new Promise((resolve, reject) => {
            RESTService.getJSON(requestOptions, (resCode, obj) => {
                if (resCode === 200) {
                    resolve(obj);
                } else {
                    reject(obj);
                }
            });;
        })
    }

    // Perhaps make this call an external API that gets order data.
    static getOrderData(productId, quantity) {
        const unit_price = 399700; // get from externalAPI with productId
        const tax_rate = 1000; // get from externalAPI with productId
        const total_amount = unit_price * quantity;
        const total_tax_amount = total_amount - total_amount * 10000 / (10000 + tax_rate);
        const order_lines = [{
            "type": "physical",
            "reference": "19-402-SWE",
            "name": "Ecom Viking",
            "quantity": quantity,
            "quantity_unit": "pcs",
            unit_price,
            tax_rate,
            total_amount,
            "total_discount_amount": 0,
            total_tax_amount
        }];
        const order_amount = order_lines[0].total_amount;
        const order_tax_amount = order_lines[0].total_tax_amount;
        console.log({
            order_amount,
            order_tax_amount,
            order_lines
        });
        return {
            order_amount,
            order_tax_amount,
            order_lines
        };
    }

    // TODO
    static getProductDetails(productId, quantity) {
        const {
            order_amount,
            order_tax_amount,
            order_lines
        } = this.getOrderData(productId, quantity);

        return JSON.stringify({
            "purchase_country": config.klarna.purchase_country,
            "purchase_currency": config.klarna.purchase_currency,
            "locale": config.klarna.locale,
            order_amount,
            order_tax_amount,
            order_lines,
            "merchant_urls": {
                "terms": `${config.klarna.merchantTermsUrl}`,
                "checkout": `${config.klarna.merchantCheckoutUrl}?order_id={checkout.order.id}"`,
                "confirmation": `${config.root_url}/confirmation?order_id={checkout.order.id}`,
                "push": `${config.root_url}/push?order_id={checkout.order.id}"`
            }
        })
    }
}

export default KlarnaService;