<?php
include('server/connection.php');
if (isset($_POST["token"])) {

    include('server/connection.php');
    $token = $_POST["token"];

    $token_hash = hash("sha256", $token);


    $sql = "SELECT * FROM users
            WHERE reset_token_hash = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $token_hash);

    $stmt->execute();

    $result = $stmt->get_result();

    $user = $result->fetch_assoc();

    if ($user === null) {
        die("Token not found");
    }

    if (strtotime($user["reset_token_expires_at"]) <= time()) {
        die("Token has expired");
    }

    if (strlen($_POST["password"]) < 6) {
        // die("Password must be at least 6 characters.");
        echo "<script>
        alert('Password must be at least 6 characters.');
        setTimeout(function() {
            window.location.href = document.referrer;
        }, 500);
    </script>";
        die;
    }

    // if (!preg_match("/[a-z]/i", $_POST["password"])) {
    //     echo "<script>
    //     alert('Password must contain at');
    //     setTimeout(function() {
    //         window.location.href = document.referrer;
    //     }, 2000);
    // </script>";
    //     die;
    // }


    if ($_POST["password"] !== $_POST["password_confirmation"]) {
        echo "<script>
        alert('Password must match');
        setTimeout(function() {
            window.location.href = document.referrer;
        }, 500);
    </script>";
        die;
    }

    echo "<script>
    console.log(" . json_encode($_POST["password"]) . ");
</script>";


    // Use password_hash() to hash the password
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $sql = "UPDATE users
            SET password = ?,
                reset_token_hash = NULL,
                reset_token_expires_at = NULL
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("ss", $password, $user["id"]);

    $stmt->execute();

    // Display success message
    echo "<script>
        alert('Password updated. You can now login. You will be redirected to the login page shortly.');
        setTimeout(function() {
            window.location.href = 'login.php';
        }, 2000);
    </script>";
}
