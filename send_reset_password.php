<?php
include('server/connection.php');
// Get the email from the POST request
$email = $_POST["email"];

// Generate a token and hash it
$token = bin2hex(random_bytes(16));
$token_hash = hash("sha256", $token);

// Set token expiry (30 minutes from now)
$expiry = date("Y-m-d H:i:s", time() + 60 * 30);

// // Include the database connection
// $conn = require __DIR__ . "/server/connection.php";  // Ensure this file returns a valid MySQLi object

// Check if the connection is valid
if (!$conn || !$conn instanceof mysqli) {
    die("Database connection failed.");
}

// Prepare the SQL query
$sql = "UPDATE users
        SET reset_token_hash = ?,
            reset_token_expires_at = ?          
        WHERE email = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die("Error preparing statement: " . $conn->error);
}

// Bind parameters and execute the statement
$stmt->bind_param("sss", $token_hash, $expiry, $email);
$stmt->execute();

// Check if any rows were affected
if ($conn->affected_rows > 0) {
    // Include the mailer script
    $mail = require __DIR__ . "/mailer.php";

    $mail->setFrom("noreply@example.com");
    $mail->addAddress($email);
    $mail->Subject = "Password Reset";
    $mail->Body = <<<END
    Click <a href="http://localhost/Infoforge/reset_password.php?token=$token">here</a> 
    to reset your password.
    END;

    try {
        $mail->send();
        echo "<script>
        alert('An email was sent. Please check your inbox.');
        window.location.href='login.php';
        </script>";
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer error: {$mail->ErrorInfo}";
    }
} else {
    echo "No user found with that email.";
}
