const bot = require('./src/bot/index.js');
const createWebhookHandler = require('./src/webhook');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { getCustomer } = require('./src/webhook/stripehelper.js');

app.use(bodyParser.raw({ type: 'application/json' }));



// To start the bot, you can simply execute:
bot.launch();

// Create the webhook route
app.post('/webhook', createWebhookHandler);

// route to get customer by id
app.get('/customer/:id', (req, res) => {
    const { id } = req.params;
    getCustomer(id).then((customer) => {
        res.status(200).json(customer);
    }
    ).catch((error) => {
        res.status(500).json(error);
    }
    );
  
});
// add user to channel


// Launch the Express app on port 4242 for the webhook
app.listen(4242, () => console.log('Webhook running on port 4242'));
