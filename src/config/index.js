const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
    root_url: process.env.ROOT_URL,
    port: process.env.PORT,
    db: {
        databaseURL: process.env.DATABASE_URI,
    },
    klarna: {
        // Base
        baseUrl: process.env.KLARNA_BASE_URL,
        publicKey: process.env.KLARNA_PUBLIC_KEY,
        secretKey: process.env.KLARNA_SECRET_KEY,
        // Checkout
        merchantTermsUrl: process.env.KLARNA_MERCHANT_TERMS_URL,
        merchantCheckoutUrl: process.env.KLARNA_MERCHANT_CHECKOUT_URL,
        purchase_country: process.env.KLARNA_PURCHASE_COUNTRY,
        purchase_currency: process.env.KLARNA_PURCHASE_CURRENCY,
        locale: process.env.KLARNA_LOCALE,
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        sender: process.env.SENDGRID_SENDER,
    }
}