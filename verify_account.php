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

$user_email = $_SESSION['user_email']; // Assuming user_email is stored in session

// Generate a random 6-digit verification code
$verification_code = rand(100000, 999999);

// Store the verification code in the database
$stmt = $conn->prepare("UPDATE users SET verification_code = ? WHERE user_email = ?");
$stmt->bind_param("is", $verification_code, $user_email);
$stmt->execute();

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
