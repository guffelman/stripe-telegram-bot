const bot = require('./src/bot/index.js');
const createWebhookHandler = require('./src/webhook');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
    getCustomer
} = require('./src/webhook/stripehelper.js');

app.use(bodyParser.raw({
    type: 'application/json'
}));

bot.launch();

app.post('/webhook', createWebhookHandler);

app.get('/customer/:id', (req, res) => {
    const {
        id
    } = req.params;
    getCustomer(id).then((customer) => {
        res.status(200).json(customer);
    }).catch((error) => {
        res.status(500).json(error);
    });

});

app.listen(4242, () => console.log('Webhook running on port 4242'));