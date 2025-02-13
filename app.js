window.paypal
  .Buttons({
    style: {
      shape: "rect",
      layout: "vertical",
      color: "silver",
      label: "paypal",
    },
    message: {
      amount: 100,
    },

    async createOrder() {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Optionally pass product IDs and quantities
          body: JSON.stringify({
            cart: [
              {
                id: "YOUR_PRODUCT_ID",
                quantity: "YOUR_PRODUCT_QUANTITY",
              },
            ],
          }),
        });

        const orderData = await response.json();

        if (orderData.id) {
          return orderData.id; // Return the PayPal order ID
        }

        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      } catch (error) {
        console.error(error);
        // Handle error if PayPal order creation fails
      }
    },

    async onApprove(data, actions) {
      try {
        const response = await fetch(
          `/api/orders/${data.orderID}/capture`, // Capture the payment
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const orderData = await response.json();

        const errorDetail = orderData?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          return actions.restart(); // Recoverable error
        } else if (errorDetail) {
          throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          // Successful transaction - Show confirmation or redirect
          const transaction =
            orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
            orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

          console.log(`Transaction ${transaction.status}: ${transaction.id}`);
        }
      } catch (error) {
        console.error(error);
        // Handle error if payment capture fails
      }
    },
  })
  .render("#paypal-button-container"); // Render PayPal button
