import config from '../../config';
import KlarnaAPIService from './KlarnaAPIService';

class KlarnaUIService {

    static getKlarnaCheckoutSnippet(productID, quantity, callback = () => {}) {
        return new Promise((resolve, reject) => { // Create order and Render checkout
            const createOrderPromise = KlarnaAPIService.createOrder(productID, quantity);
            createOrderPromise.then(response => {
                const klarna_checkout = response.html_snippet;
                resolve(klarna_checkout);
                callback();
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    static getKlarnaConfirmationSnippet(order_id, callback = () => {}) {
        return new Promise((resolve, reject) => { // Create order and Render checkout
            // Get and Render order confirmation
            const readOrderPromise = KlarnaAPIService.readOrder(order_id);
            readOrderPromise.then(({
                klarna_response,
                klarna_confirmation_snippet
            }) => {
                resolve({
                    klarna_response,
                    klarna_confirmation_snippet
                });
                callback(klarna_response);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    static renderKlarnaCheckout(appRes, productID, quantity, callback = () => {}) {
        this.getKlarnaCheckoutSnippet(productID, quantity, callback).then((snippetResponse) => {
            appRes.render('checkout', {
                title: `Betala med Klarna - ${config.mmr.customer.name}`,
                klarna_checkout: snippetResponse
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    static renderKlarnaPaymentConfirmation(appRes, order_id, callback = () => {}) {
        this.getKlarnaConfirmationSnippet(order_id, callback).then(({
            klarna_response,
            klarna_confirmation_snippet
        }) => {
            const billing_address = klarna_response.billing_address;
            const email = billing_address.email;
            const name = `${billing_address.given_name} ${billing_address.family_name}`
            const password = Math.random().toString(36).slice(-8); // randomize pass
            appRes.render('checkout', {
                title: `Order bekräftad! - ${config.mmr.customer.name}`,
                klarna_confirmation: klarna_confirmation_snippet,
                email: email,
                password: password,
            });
        }).catch((err) => {
            console.error(err);
        });
    }

}

export default KlarnaUIService;