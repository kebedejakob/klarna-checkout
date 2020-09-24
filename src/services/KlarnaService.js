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

    static createOrder() {
        const requestOptions = this.getKlarnaRequestOptions();
        requestOptions.path = '/checkout/v3/orders';
        requestOptions.method = 'POST';
        const orderBody = this.getProductDetails('id');
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

    // TODO
    static getProductDetails(id) {
        return JSON.stringify({
            "purchase_country": "SE",
            "purchase_currency": "SEK",
            "locale": "sv",
            "order_amount": 50000,
            "order_tax_amount": 4545,
            "order_lines": [{
                "type": "physical",
                "reference": "19-402-USA",
                "name": "Red T-Shirt",
                "quantity": 5,
                "quantity_unit": "pcs",
                "unit_price": 10000,
                "tax_rate": 1000,
                "total_amount": 50000,
                "total_discount_amount": 0,
                "total_tax_amount": 4545
            }],
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