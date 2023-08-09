const stripe = require('stripe')('sk_test');

async function createCustomerAndSubscription() {
    try {

        const customer = await stripe.customers.create({
            name: 'Test Customer',
            email: 'test@me.com',
            phone: '12223334444',
            payment_method: 'pm_card_visa',

            invoice_settings: {
                default_payment_method: 'pm_card_visa',
            },

        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: 'price_1NaqygIwIAppg9pCvdiWSSCO'
            }],
            default_payment_method: customer.invoice_settings.default_payment_method,
            trial_period_days: 7,
            expand: ['latest_invoice.payment_intent'],
        });

        console.log('Customer:', customer);
        console.log('Subscription:', subscription);
        console.log('First Payment Intent:', subscription.latest_invoice.payment_intent);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createCustomerAndSubscription();