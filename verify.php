<?php
session_start();
include('server/connection.php');

if (isset($_POST['verification_code'])) {
    $verification_code = $_POST['verification_code'];
    $email = $_SESSION['email_for_verification'];  // Retrieve the email from session

    // Fetch the stored verification code from the database
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $stored_code = $user['verification_code'];

        // Check if the entered verification code matches the stored one
        if ($verification_code == $stored_code) {
            // Mark the email as verified and clear the verification code
            $stmt2 = $conn->prepare("UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?");
            $stmt2->bind_param("s", $email);
            $stmt2->execute();

            // $_SESSION['user_id'] = $user_id;
            // $_SESSION['user_name'] = $user_na
            // $_SESSION['user_email'] = $
            $_SESSION['logged_in'] = true;
            $_SESSION['role'] = 'user';

            // Redirect to account page after successful verification
            header('Location: account.php?verification_success=Your email has been verified successfully.');
            exit();
        } else {
            // Incorrect code
            header('Location: account.php?error=Incorrect verification code. Please try again.');
            exit();
        }
    } else {
        header('Location: account.php?error=No user found with this email.');
        exit();
    }
}
