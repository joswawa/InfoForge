<!-- Header -->
<?php include('layouts/header.php'); ?>
<section class="my-5 py-5 min-vh-100">
    <div class="container mt-3 pt-5">
        <h1 class="fw-bold sage-color mb-3">Reset Password</h1>
        <hr class="w-100 mb-5">
    </div>
    <div class="container text-center mb-5 sage-color">
        <h3>Please enter the email address for your account and we will reach out to you!</h3>
    </div>
    <div class="mx-auto container w-25 text-center">

        <form method="post" action="send_reset_password.php">
            <div class="form-group">
                <label for="email"><span>Email</span></label>
                <input class="form-control" type="email" name="email" id="email" required>
            </div>
            <div class="form-group mt-4">
                <input class="btn btn-primary sage-btn" id="reset-btn" type="submit" name="reset-btn" value="Reset Password">
            </div>
        </form>
    </div>
</section>
<!-- Footer -->
<?php include('layouts/footer.php'); ?>