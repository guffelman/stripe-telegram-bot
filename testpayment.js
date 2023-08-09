const stripe = require('stripe')('sk_test');


async function createCustomerAndSubscription() {
  try {
    // Step 1: Create a customer
    const customer = await stripe.customers.create({
        name: 'Test Customer', // Replace with the customer's full name
      email: 'test@me.com', // Replace with the customer's email
      phone: '12223334444',
      payment_method: 'pm_card_visa', // Use a test card or a valid payment method
      // Set the default payment method on the customer
        invoice_settings: {
            default_payment_method: 'pm_card_visa',
        },

    });

    // Step 2: Create a subscription with first-time payment
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'price_1NaqygIwIAppg9pCvdiWSSCO' }], // Replace with the ID of your product price
      default_payment_method: customer.invoice_settings.default_payment_method,
      trial_period_days: 7, // You can set a trial period if needed
      expand: ['latest_invoice.payment_intent'],
    });

    console.log('Customer:', customer);
    console.log('Subscription:', subscription);
    console.log('First Payment Intent:', subscription.latest_invoice.payment_intent);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the function to create customer and subscription
createCustomerAndSubscription();
