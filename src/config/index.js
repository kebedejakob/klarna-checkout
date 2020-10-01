const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

let conf;
if (process.env.NODE_ENV === 'production') {
    conf = {
        root_url: process.env.PROD_ROOT_URL,
        port: process.env.PORT,
        db: {
            databaseURL: process.env.DATABASE_URI,
        },
        klarna: {
            // Base
            baseUrl: process.env.PROD_KLARNA_BASE_URL,
            publicKey: process.env.PROD_KLARNA_PUBLIC_KEY,
            secretKey: process.env.PROD_KLARNA_SECRET_KEY,
            // Checkout
            merchantTermsUrl: process.env.KLARNA_MERCHANT_TERMS_URL,
            merchantCheckoutUrl: process.env.KLARNA_MERCHANT_CHECKOUT_URL,
            purchase_country: process.env.KLARNA_PURCHASE_COUNTRY,
            purchase_currency: process.env.KLARNA_PURCHASE_CURRENCY,
            locale: process.env.KLARNA_LOCALE,
        },
        zapier: {
            webhook_host: process.env.ZAPIER_WEBHOOK_HOST,
            create_teachable_account_path: process.env.ZAPIER_CREATE_TEACHABLE_ACCOUNT_WEBHOOK_PATH,
        },
        mmr: {
            customer: {
                name: process.env.CUSTOMER_NAME
            }
        }
    }
} else if (process.env.NODE_ENV === 'development') {
    conf = {
        root_url: process.env.DEV_ROOT_URL,
        port: process.env.PORT,
        db: {
            databaseURL: process.env.DATABASE_URI,
        },
        klarna: {
            // Base
            baseUrl: process.env.DEV_KLARNA_BASE_URL,
            publicKey: process.env.DEV_KLARNA_PUBLIC_KEY,
            secretKey: process.env.DEV_KLARNA_SECRET_KEY,
            // Checkout
            merchantTermsUrl: process.env.KLARNA_MERCHANT_TERMS_URL,
            merchantCheckoutUrl: process.env.KLARNA_MERCHANT_CHECKOUT_URL,
            purchase_country: process.env.KLARNA_PURCHASE_COUNTRY,
            purchase_currency: process.env.KLARNA_PURCHASE_CURRENCY,
            locale: process.env.KLARNA_LOCALE,
        },
        zapier: {
            webhook_host: process.env.ZAPIER_WEBHOOK_HOST,
            create_teachable_account_path: process.env.ZAPIER_CREATE_TEACHABLE_ACCOUNT_WEBHOOK_PATH,
        },
        mmr: {
            customer: {
                name: process.env.CUSTOMER_NAME
            }
        }
    }
}

export default conf;