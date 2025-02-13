<?php
include('server/connection.php');

$token = $_GET["token"];

$token_hash = hash("sha256", $token);
$sql = "SELECT * FROM users
        WHERE reset_token_hash = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $token_hash);

$stmt->execute();

$result = $stmt->get_result();

$user = $result->fetch_assoc();

if ($user === null) {
    die("token not found");
}

if (strtotime($user["reset_token_expires_at"]) <= time()) {
    die("token has expired");
}

?>
<!-- Header -->
<?php include('layouts/header.php'); ?>
<section class="my-5 py-5">
    <div class="container text-center mt-3 pt-5">
        <h2 class="form-weight-bold">Reset Password</h2>
        <hr class="mx-auto">
    </div>
    <div class="mx-auto container w-25 text-center">

        <form method="post" action="process-reset-password.php">

            <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
            <div class="form-group">
                <label for="password"><span>New password</span></label>
                <input class="form-control" type="password" id="password" name="password">
            </div>
            <div class="form-group">
                <label for="password_confirmation"><span>Repeat password</span></label>
                <input class="form-control" type="password" id="password_confirmation"
                    name="password_confirmation">
            </div>
            <div class="form-group mt-3">
                <button>Send</button>
            </div>
        </form>
    </div>

    <!-- Footer -->
    <?php include('layouts/footer.php'); ?>