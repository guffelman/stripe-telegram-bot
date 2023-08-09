// stripe helper - queries stripe for customer and subscription info

const stripe = require("stripe")(
  "sk_test_"
);

async function getCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// get customer by email
async function getCustomerByEmail(email) {
  try {
    const customer = await stripe.customers.list({ email: email });
    console.log(customer);
    console.log(customer.metadata)
    // convert to json
    return customer;
  } catch (error) {
    console.error("Error:", error.message);
  }
}



//  getCustomerByEmail('garrettuffelman@me.com')
//isCustomerActiveByEmail('garrettuffelman@me.com')
// {
//     object: 'list',
//     data: [
//       {
//         id: 'cus_OO0K79KjHdceeN',
//         object: 'customer',
//         address: null,
//         balance: 0,
//         created: 1691118264,
//         currency: 'usd',
//         default_source: null,
//         delinquent: false,
//         description: null,
//         discount: null,
//         email: 'garrettuffelman@me.com',
//         invoice_prefix: '9329A7E1',
//         invoice_settings: [Object],
//         livemode: false,
//         metadata: {},
//         name: 'Garrett Uffelman',
//         next_invoice_sequence: 2,
//         phone: '12605578838',
//         preferred_locales: [],
//         shipping: null,
//         tax_exempt: 'none',
//         test_clock: null
//       }
//     ],
//     has_more: false,
//     url: '/v1/customers'
//   }

//determine if customer  delinquent
async function isCustomerActiveByEmail(email) {
  try {
    const customer = await stripe.customers.list({ email: email });
    // if customer doesn't exist, then fail.
    if (customer.data.length == 0) {
        console.log("Customer does not exist");
        return false;
        }
    delinquent = customer.data[0].delinquent;
    if (delinquent == false) {
      console.log("Customer is active");
      return true;
    } else {
      console.log("Customer is not active");
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function isCustomerActiveByPhone(phone) {
  try {
    const customers = await stripe.customers.list();
    const customerWithPhone = customers.data.find((customer) => customer.phone === phone);

    if (!customerWithPhone) {
      console.log("Customer does not exist");
      return false;
    }

    const delinquent = customerWithPhone.delinquent;
    
    if (!delinquent) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

async function updateCustomerTeleIDbyEmail(email, teleid) {
  try {
    // store teleid into custom metadata field.
    // if customer doesn't exist, then fail.
    const customer = await stripe.customers.list({ email: email });

    // if customer doesn't exist, then fail.
    if (customer.data.length == 0) {
      console.log("Customer does not exist");
      return false;
    }
    // update customer metadata
    const updatedCustomer = await stripe.customers.update(customer.data[0].id, {
      metadata: {
        teleid: teleid,
      },
    });
    return updatedCustomer;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function updateCustomerTeleIDbyPhone(phone, teleid) {
  try {
    // Retrieve all customers
    const customers = await stripe.customers.list();

    // Find the customer with the matching phone number
    const matchingCustomer = customers.data.find(customer => customer.phone === phone);

    if (!matchingCustomer) {
      console.log("Customer does not exist");
      return false;
    }

    // Update customer metadata
    const updatedCustomer = await stripe.customers.update(matchingCustomer.id, {
      metadata: {
        teleid: teleid,
      },
    });

    return updatedCustomer;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function updateCustomerTeleID(id, teleid) {
  try {
    // store teleid into custom metadata field.
    // if customer doesn't exist, then fail.
    const customer = await stripe.customers.list({ id: id });

    // if customer doesn't exist, then fail.
    if (customer.data.length == 0) {
      console.log("Customer does not exist");
      return false;
    }
    // update customer metadata
    const updatedCustomer = await stripe.customers.update(id, {
      metadata: {
        teleid: teleid,
      },
    });
    return updatedCustomer;
  } catch (error) {
    console.error("Error:", error.message);
  }
}




async function getCustomerMetadata(id) {
  try {
    // Retrieve customer by ID
    const customer = await stripe.customers.retrieve(id);
    console.log(customer)
    // If customer doesn't exist, then fail.
    if (!customer) {
      console.log("Customer does not exist");
      return null;
    }

    // Log customer metadata
    // console.log(customer.data.metadata);

    return customer.metadata; // Return the metadata object
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}




//updateCustomerTeleID("garrettuffelman@me.com", "6060801522");

// isCustomerActiveByEmail("garrettuffelman@me.com");
// returns: true!

module.exports = { getCustomer, getCustomerByEmail, getCustomerMetadata, isCustomerActiveByEmail, isCustomerActiveByPhone, updateCustomerTeleID, updateCustomerTeleIDbyEmail, updateCustomerTeleIDbyPhone };
