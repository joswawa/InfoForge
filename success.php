<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer classes
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// Start session to access session variables
session_start();

if (!isset($_SESSION['email'])) {
    echo "No email found in session!";
    exit;
}

if (isset($_GET['receipt'])) {
    $receipt_file = $_GET['receipt'];
    $file_path = "receipts/$receipt_file";

    if (file_exists($file_path)) {
        try {
            // Create new PHPMailer instance
            $mail = new PHPMailer(true);

            // Enable SMTP
            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $mail->Host = "smtp.gmail.com";
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->Username = "zen.bugarin2024@gmail.com"; // Sender email
            $mail->Password = "fpcw irtc gdow xsjy"; // Gmail App password

            // Set sender and recipient
            $mail->setFrom("zen.bugarin2024@gmail.com", "Infoforge"); // Sender's details
            $mail->addAddress($_SESSION['email']); // Recipient from session

            // Email subject and body
            $mail->Subject = "Your Receipt - Payment Successful";
            $mail->Body = "<p>Dear customer,</p><p>Your payment was successful. Please find your receipt attached.</p>";
            $mail->isHTML(true); // Set email format to HTML

            // Attach the receipt PDF
            $mail->addAttachment($file_path);

            // Send email
            $mail->send();
            echo "<p>Email has been sent successfully to {$_SESSION['email']} with your receipt attached.</p>";
        } catch (Exception $e) {
            echo "<p>Failed to send email. Error: " . $mail->ErrorInfo . "</p>";
        }
    } else {
        echo "<p>Receipt not found.</p>";
    }
} else {
    echo "<p>No receipt available.</p>";
}

header('Location: ../order-page.php?payment_message=Payment successful, order receipt sent to email.');
exit();
