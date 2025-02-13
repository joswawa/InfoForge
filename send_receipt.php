<?php
session_start();
include('server/connection.php'); // Your connection file

// Check if the user is logged in
if (isset($_SESSION['logged_in'])) {
    if ($_SESSION['role'] === 'user') {
        header('location: account.php');
    } elseif ($_SESSION['role'] === 'admin') {
        header('location: account.php');
    }
    exit;
}

// $pdfPathfile 

// Send verification email
$subject = "Account Verification Code";
$message = "Your verification code is: $verification_code";
$headers = "From: no-reply@yourdomain.com";

// Send the email
if (mail($user_email, $subject, $message, $headers)) {
    // Redirect to account.php with a success message
    header('Location: account.php?message=Verification code sent to your email');
    exit;
} else {
    // If email failed to send
    header('Location: account.php?error=Failed to send verification email');
    exit;
}
