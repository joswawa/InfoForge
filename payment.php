<?php
ini_set('display_errors', 0); // Disable displaying errors
ini_set('log_errors', 1); // Enable logging errors
session_start();
include('server/connection.php');
if (isset($_SESSION['selected_total']) && isset($_SESSION['order_ids'])) {
    $amount = number_format($_SESSION['selected_total'], 2, '.', '');
    $order_id = $_SESSION['order_ids'];
    // echo '<script>console.log("hdfghfghdfghdfghdfgh: ' . json_encode($order_id) . '");</script>';
    // die;
} else {
    // echo "Order information is missing. Please try again.";
    exit();
}

if (isset($_SESSION['ids'])) {
    $order_ids = $_SESSION['ids'];
    // echo '<script>console.log("hdfghfghdfghdfghdfgh: ' . json_encode($order_ids) . '");</script>';
    // die;
}

if (isset($_SESSION['order_ids'])) {
    $product_ids = $_SESSION['order_ids'];
    // echo '<script>console.log("eeeee: ' . json_encode($product_ids) . '");</script>';
    // die;
}

// if (isset($_SESSION['selected_total']) && isset($_SESSION['order_id'])) {
//     $amount = number_format($_SESSION['selected_total'], 2, '.', '');
//     $order_id = $_SESSION['order_id'];
// } else {
//     // echo "Order information is missing. Please try again.";
//     exit();
// }

if (isset($_POST['order_pay_btn'])) {
    $order_id = $_POST['ID'];
    $orderQuantity = $_POST['ordQuantity'];
    $order_status = $_POST['orderStat'];
    $order_total_price = $_POST['orderTotal'];
    $productName = $_POST['prod_name'];
    $product_price = $_POST['ordPrice'];
}
?>


<?php include('layouts/header.php'); ?>

<!-- Payment -->
<section class="my-3 min-vh-100">

    <div class="container-fluid pt-3">
        <h1 class="fw-bold mt-5 sage-color pt-5 ms-5">Payment</h1>
        <hr class="w-100">

        <!-- Responsive Navigation -->
        <div class="d-flex justify-content-start align-items-center mt-5 account-nav flex-nowrap overflow-auto">
            <div class="p-3 flex-shrink-0 pe-5">
                <h3 class="fw-normal" onclick="window.location.href='cart.php'">Your Cart</h3>
            </div>
            <div class="p-3 flex-shrink-0 pe-5">
                <h3 class="fw-normal" onclick="window.location.href='checkout.php'">Checkout</h3>
            </div>
            <div class="p-3 flex-shrink-0 pe-5 selected-nav">
                <h3 class="fw-normal">Payment</h3>
            </div>
        </div>
    </div>
    <div class="mx-auto container text-center mt-5">

        <div class="container w-50 gray-bg-color">

            <h2 class="sage-color text-start">Pay now</h2>
            <hr class="w-100 mb-4">

            <?php if (isset($_POST['order_status']) && $_POST['order_status'] != "not yet paid") { ?>
                <?php $amount = number_format($order_total_price, 2, '.', ''); ?>
                <?php $order_id = $_POST['order_id']; ?>
                <p>Total Payment: ₱<?php echo number_format($order_total_price, 2, '.', ''); ?></p>
                <div class="d-flex justify-content-center mt-5">
                    <div id="paypal-button-container"></div>
                </div>

            <?php } else if (isset($_SESSION['selected_total']) && $_SESSION['selected_total'] > 0) { ?>
                <?php $amount = number_format($_SESSION['selected_total'], 2, '.', ''); ?>
                <?php $order_id = $_SESSION['order_id']; ?>
                <p>Total payment: ₱<?php echo number_format($_SESSION['selected_total'], 2); ?></p>
                <hr class="w-100 mb-4">
                <div class="d-flex justify-content-center">
                    <div id="paypal-button-container" class="text-center w-75"></div>
                </div>

            <?php } else { ?>
                <p>Your cart is empty</p>
            <?php } ?>
        </div>
    </div>
</section>

<!-- Include jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- PayPal SDK sandbox-->
<script defer src="https://www.paypal.com/sdk/js?client-id=AVFKSVju2Na6_Kmj5c0tU91lJm9hcuSZJBcUSXAjLNGlc_O0nkImxeCMW8DP3H0q2Q9W9mPxNGWHJ6Wk&currency=PHP&components=buttons&enable-funding=venmo,paylater,card"></script>
<!-- PayPal SDK -->
<!-- <script defer src="https://www.paypal.com/sdk/js?client-id=AfqqSU381LHnZ1pAYw9Rmp8inoHgvhBvUhia7aIoEdTjqkUFoqMpWzUsjMv61eBModICiGQe5YA1TDIX&currency=PHP&components=buttons&enable-funding=venmo,paylater,card"></script> -->

<!-- value: '<?php echo $amount; ?>', -->
<!-- Ensure PayPal buttons are initialized after PayPal SDK is fully loaded -->
<script>
    $(document).ready(function() {
        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '1',
                                currency_code: 'PHP',
                            },
                        }],
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        const transaction = details.purchase_units[0].payments.captures[0];
                        var user_id = <?php echo $_SESSION['user_id']; ?>;
                        var orderid = <?php echo json_encode($_SESSION['order_ids']); ?>;
                        console.log('Transaction Details:', transaction);
                        console.log('User ID:', user_id);

                        $.ajax({
                            method: "POST",
                            url: "paypal_processor.php",
                            data: {
                                orderID: orderid,
                                transaction_id: transaction.id,
                                user: user_id,
                                transaction_status: transaction.status
                            },
                            success: function(response) {
                                console.log('Response:', response);
                                if (response.status === 'success') {
                                    alert("Payment Successful. Transaction ID: " + transaction.id);

                                    // Convert the order ID array to a comma-separated string if needed for the URL
                                    var orderidString = orderid.join(',');

                                    window.location.href = "server/complete_payment.php?transaction_id=" + transaction.id + "&order_id=" + orderidString;
                                } else {
                                    alert('Failed to process payment: ' + response.message);
                                }
                            },

                            error: function(xhr, status, error) {
                                console.error('AJAX Error: ' + error);
                                alert('An error occurred. Please try again.');
                            }
                        });
                    });
                },
                onError: function(error) {
                    console.error(error);
                    alert('An error occurred while processing the payment. Please try again later.');
                }
            }).render('#paypal-button-container');
        } else {
            console.error("PayPal SDK not loaded properly.");
            alert('Unable to load PayPal buttons. Please refresh the page.');
        }
    });
</script>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>