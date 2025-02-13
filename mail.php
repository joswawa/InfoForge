<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function sendEmail($recipientEmail, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username   = "zen.bugarin2024@gmail.com";
        $mail->Password   = "fpcw irtc gdow xsjy";  // App-specific password for Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('zen.bugarin2024@gmail.com', 'infoforge');
        $mail->addAddress($recipientEmail);
        $mail->Subject = $subject;
        $mail->Body = $body;

        if ($mail->send()) {
            return true;
        } else {
            error_log('Mailer Error: ' . $mail->ErrorInfo); // Log any errors
            return false;
        }
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>

