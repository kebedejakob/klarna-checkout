const http = require('http');
const https = require('https');

class RESTService {
    static getJSON(requestOptions, onResult) {
        const port = requestOptions.port == 443 ? https : http;
        let output = '';

        const req = port.request(requestOptions, (res) => {
            console.log(`${requestOptions.host} : ${res.statusCode}`);
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                output += chunk;
            });

            res.on('end', () => {
                let obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });

        req.on('error', (err) => {
            console.error(err);
            // res.send('error: ' + err.message);
        });

        if (requestOptions.body) {
            req.write(requestOptions.body); // Used in POST req
        }
        req.end();
    };
}

export default RESTService;