const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034",
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
);

const createOrder = async (
  order_id,
  order_currency,
  order_amount,
  customer_detail,
  frontend_base_url
) => {
  try {
    const { customer_id, customer_name, customer_email } = customer_detail;
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24); // 1day from now
    const formattedExpiryDate = expiryDate.toISOString();
    const request = {
      order_amount: order_amount,
      order_currency: order_currency,
      order_id: order_id,
      customer_details: {
        customer_id: customer_id,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: "8957198527",
      },
      order_meta: {
        return_url: `http://localhost:3000/payments/payment-status/${order_id}?frontend_base_url=${encodeURIComponent(
          frontend_base_url
        )}`,
        payment_methods: "upi",
      },
      order_expiry_time: formattedExpiryDate,
    };
    const result = await cashfree.PGCreateOrder(request);
    return result.data.payment_session_id;
  } catch (error) {
    console.error(
      "createOrder failed:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const getPaymentStatus = async (order_id) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(order_id);
    const response_data = response.data;
    if (!response_data || response_data.length === 0) {
      return "PENDING";
    }
    const successful_payments = response_data.filter(
      (transaction) => transaction.payment_status === "SUCCESS"
    );
    if (successful_payments.length > 0) {
      return "SUCCESS";
    }

    const failed_payments = response_data.filter(
      (transaction) => transaction.payment_status === "FAILED"
    );

    if (failed_payments.length > 0) {
      return "FAILED";
    }

    return "PENDING";
  } catch (error) {
    throw error;
  }
};

module.exports = { createOrder, getPaymentStatus };
