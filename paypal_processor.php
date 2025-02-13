<?php
session_start();
include('server/connection.php');
if (isset($_POST['transaction_id'], $_POST['user'], $_POST['transaction_status'])) {
    $transaction_id = $_POST['transaction_id'];
    $user_id = $_POST['user'];
    $transaction_status = $_POST['transaction_status'];
    $orderID = $_POST['orderID'];
    // die("check iDs: " . json_encode($orderID));

    // You can process the payment status here and update your database
    // Example query to update the order status (you should adjust based on your database structure)
    $query = "UPDATE orders SET order_status = 'paid', transaction_id = ? WHERE order_id = ? AND order_status = 'not paid'";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('si', $transaction_id, $orderID);

    if ($stmt->execute()) {

        header('Content-Type: application/json');
        $response = [
            'status' => 'success',
            'message' => 'Order processed successfully'
        ];
        echo json_encode($response);
    } else {
        header('Content-Type: application/json');
        $response = [
            'status' => 'error',
            'message' => 'Failed to update order: ' . $stmt->error // Include specific error
        ];
        echo json_encode($response);
    }
} else {
    // Missing required POST fields
    $response = [
        'status' => 'error',
        'message' => 'Missing order data'
    ];
    echo json_encode($response);
}
