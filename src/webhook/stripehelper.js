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

async function getCustomerByEmail(email) {
  try {
      const customer = await stripe.customers.list({
          email: email
      });
      console.log(customer);
      console.log(customer.metadata)

      return customer;
  } catch (error) {
      console.error("Error:", error.message);
  }
}

async function isCustomerActiveByEmail(email) {
  try {
      const customer = await stripe.customers.list({
          email: email
      });

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

      const customer = await stripe.customers.list({
          email: email
      });

      if (customer.data.length == 0) {
          console.log("Customer does not exist");
          return false;
      }

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

      const customers = await stripe.customers.list();

      const matchingCustomer = customers.data.find(customer => customer.phone === phone);

      if (!matchingCustomer) {
          console.log("Customer does not exist");
          return false;
      }

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

      const customer = await stripe.customers.list({
          id: id
      });

      if (customer.data.length == 0) {
          console.log("Customer does not exist");
          return false;
      }

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

      const customer = await stripe.customers.retrieve(id);
      console.log(customer)

      if (!customer) {
          console.log("Customer does not exist");
          return null;
      }

      return customer.metadata;
  } catch (error) {
      console.error("Error:", error.message);
      return null;
  }
}

module.exports = {
  getCustomer,
  getCustomerByEmail,
  getCustomerMetadata,
  isCustomerActiveByEmail,
  isCustomerActiveByPhone,
  updateCustomerTeleID,
  updateCustomerTeleIDbyEmail,
  updateCustomerTeleIDbyPhone
};