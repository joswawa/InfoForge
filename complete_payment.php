<?php
session_start();
require('fpdf186/fpdf.php');
include('server/connection.php');

// Ensure the transaction is valid
if (isset($_GET['transaction_id']) && isset($_SESSION['order_id']) && isset($_SESSION['user_id'])) {
    $transaction_id = $_GET['transaction_id'];
    $order_id = $_SESSION['order_ids'];
    $user_id = $_SESSION['user_id'];

    // var_dump($transaction_id, $order_id, $user_id);
    // die;

    // Fetch order details from the database
    $stmt = $conn->prepare("
        SELECT p.product_name, o.order_quantity, p.price, (o.order_quantity * p.price) AS total_price
        FROM orders o
        JOIN products_previous p ON o.product_name = p.product_name
        WHERE o.order_id = ? AND o.user_id = ?
    ");

    foreach ($order_id as $order_ID) {
    }
    $stmt->bind_param('ii', $order_ID, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Initialize FPDF
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);

        // Add Title
        $pdf->Cell(190, 10, 'Order Receipt', 0, 1, 'C');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Ln(10);

        // Add transaction details
        $pdf->Cell(190, 10, "Transaction ID: $transaction_id", 0, 1);
        $pdf->Cell(190, 10, "Order ID: $order_ID", 0, 1);
        $pdf->Cell(190, 10, "Customer: {$_SESSION['user_name']} ({$_SESSION['user_email']})", 0, 1);
        $pdf->Ln(10);

        // Add table headers
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(80, 10, 'Product Name', 1);
        $pdf->Cell(30, 10, 'Quantity', 1);
        $pdf->Cell(30, 10, 'Price', 1);
        $pdf->Cell(40, 10, 'Total', 1);
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 12);
        $grand_total = 0;

        // Add product details
        while ($row = $result->fetch_assoc()) {
            $pdf->Cell(80, 10, $row['product_name'], 1);
            $pdf->Cell(30, 10, $row['order_quantity'], 1, 0, 'C');
            $pdf->Cell(30, 10, number_format($row['price'], 2), 1, 0, 'R');
            $pdf->Cell(40, 10, number_format($row['total_price'], 2), 1, 0, 'R');
            $pdf->Ln();

            $grand_total += $row['total_price'];
        }

        // Add Grand Total
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(140, 10, 'Grand Total', 1);
        $pdf->Cell(40, 10, number_format($grand_total, 2), 1, 0, 'R');
        $pdf->Ln(20);

        // TO EMAIL
        $file_name = "receipt_order_$order_ID.pdf";
        $pdf->Output('F', "receipts/$file_name");

        // send to email
        $pdfPathfile = "receipts/$file_name";

        // Send verification email
        $subject = "Order Receipt - Order #$order_ID";
        $message = "Thank you for your purchase! Please find your order receipt attached.";
        $headers = "From: no-reply@yourdomain.com";

        // Send the email
        if (mail($user_email, $subject, $message, $headers)) {
            // Redirect to account.php with a success message
            header("Location: success.php?receipt=$file_name");
            exit;
        } else {
            // If email failed to send
            header('Location: account.php?error=Failed to send verification email');
            exit;
        }

        // header("Location: ./success.php?receipt=$file_name");
        // exit();
    } else {
        echo "Order not found.";
    }
} else {
    echo "Invalid transaction.";
}
