const stripe = require('stripe')('sk_test_');
const {
    bot,
    removeUserFromChannel
} = require('../bot/events');
const {
    getCustomer,
    getCustomerByEmail,
    getCustomerMetadata,
    isCustomerActiveByEmail,
    updateCustomerTeleID
} = require('./stripehelper.js');
const fixedPhoneNumber = '6060801522';
const endpointSecret = "whsec_";
const channelIds = ['-1001926259682'];

async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        console.log(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'customer.created':
            const customerCreated = event.data.object;
            bot.telegram.sendMessage(fixedPhoneNumber, `New customer created: ${customerCreated.name} (${customerCreated.email}) - ${customerCreated.phone}`);
            break;

        case 'customer.subscription.created':
            const subscriptionCreated = event.data.object;
            bot.telegram.sendMessage(fixedPhoneNumber, `New subscription created: ${subscriptionCreated.plan.product} - ${subscriptionCreated.plan.nickname}`);
            break;

        case 'invoice.payment_succeeded':
            const invoicePaymentSucceeded = event.data.object;
            bot.telegram.sendMessage(fixedPhoneNumber, `Payment successful: ${invoicePaymentSucceeded.total} ${invoicePaymentSucceeded.currency}`);
            break;

        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            bot.telegram.sendMessage(fixedPhoneNumber, `Payment failed for ${paymentIntentFailed.amount} ${paymentIntentFailed.currency}. Reason: ${paymentIntentFailed.last_payment_error.message}`);
            break;

        case 'customer.subscription.deleted':
            const subscriptionDeleted = event.data.object;

            getCustomerMetadata(subscriptionDeleted.customer)
                .then((metadata) => {
                    if (!metadata) {
                        console.log("Customer metadata not found");
                        return;
                    }

                    console.log(metadata.teleid);

                    channelIds.forEach(async (channelId) => {
                        await removeUserFromChannel(metadata.teleid, channelId);
                    });

                    bot.telegram.sendMessage(fixedPhoneNumber, `Subscription canceled: ${subscriptionDeleted.plan.product} - ${subscriptionDeleted.plan.nickname}`);
                })
                .catch((error) => {
                    console.error("Error retrieving customer metadata:", error);
                });
            break;

        case 'charge.refunded':
            const chargeRefunded = event.data.object;

            bot.telegram.sendMessage(fixedPhoneNumber, `Charge refunded: ${chargeRefunded.amount} ${chargeRefunded.currency}`);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
}

module.exports = handleStripeWebhook;