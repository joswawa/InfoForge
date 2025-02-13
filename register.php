<?php
include('server/mail.php');
$_SESSION['table'] = 'users';
session_start();
include('server/connection.php');
if (isset($_POST['register'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];
    $street = $_POST['street'];



    // if passwords do not match
    if ($password !== $confirmPassword) {
        header('location: register.php?error="passwords dont match"');
    }
    // if password is less than 6 characters
    else if (strlen($password) < 6) {
        header('location: register.php?error=password must be at least 6 characters');
    }
    // if there's no error
    else {
        // Check whether there is a user with this email
        $stmt1 = $conn->prepare("SELECT * FROM users where email=?");
        $stmt1->bind_param('s', $email);
        $stmt1->execute();
        $stmt1->store_result();

        // If there is a user already registered with this email
        if ($stmt1->num_rows > 0) {
            header('location: register.php?error=user with this email already exists');
        }
        // If no user registered with this email before
        else {
            // Create a new user
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, address)
                VALUES (?, ?, ?, ?)");

            $hash_password = password_hash($password, PASSWORD_DEFAULT); // Change to password_hash() for stronger security in production
            $stmt->bind_param('ssss', $name, $email, $hash_password, $street);

            // If account was created successfully
            if ($stmt->execute()) {
                // Generate the verification code
                $verification_code = rand(100000, 999999);

                // Store the verification code in the database
                $stmt2 = $conn->prepare("UPDATE users SET verification_code = ? WHERE email = ?");
                $stmt2->bind_param("is", $verification_code, $email);
                $stmt2->execute();

                // Send verification email
                $subject = "Account Verification Code";
                $message = "Your verification code is: $verification_code";
                send_mail($email, $subject, $message);

                // Store a session variable to show the modal
                $form_data = $_SESSION['form_data'] ?? [];
                $_SESSION['user_name'] = $name;
                $_SESSION['user_email'] = $email;
                $_SESSION['email_for_verification'] = $email;
                $_SESSION['email_for_verification'] = $email;
                $_SESSION['show_modal'] = true;
                $_SESSION['success_message'] = "You registered successfully. Please check your email to verify your account.";
                // // Redirect to the same page without immediately closing the modal
                // header('location: register.php');
            }
            // Account could not be created
            else {
                header('location: register.php?error=could not create an account at the moment');
            }
        }
    }
}

?>



<!-- Header -->
<?php include('layouts/header.php'); ?>

<!-- SIGNUP -->

<section class=" d-flex align-items-center min-vh-100 login-section mt-5">
    <div class="container mt-5 form-grid">
        <div class="row g-0 mt-5" id="form-grid">
            <div class="  col-lg-6 col-sm-12 d-flex align-items-center justify-content-start">
                <div class="w-100 py-5 px-5 text-center card card-form">
                    <div class="container text-center ">
                        <h2 class="form-weight-bold">Register</h2>
                        <!-- <hr class="mx-auto"> -->
                    </div>
                    <form id="register-form" method="POST" action="register.php">
                        <p style="color: red;"><?php if (isset($_GET['error'])) {
                                                    echo $_GET['error'];
                                                } ?></p>

                        <div class="form-group mb-3">
                            <label>Name</label>
                            <input class="form-control" type="text" name="name" value="<?php echo isset($_SESSION['form_data']['user_name']) ? htmlspecialchars($_SESSION['form_data']['user_name']) : ''; ?>" id=" register-name" placeholder="Name" oninput="this.value = this.value.replace(/[0-9]/g, '')" required>
                        </div>
                        <div class="form-group mb-3">
                            <label>Email</label>
                            <input class="form-control" type="email" name="email" id="register-email" placeholder="Email" required>
                        </div>
                        <div class="form-group mb-3">
                            <label>Address</label>
                            <input class="form-control" type="text" name="street" id="register-street" placeholder="Address" required>
                        </div>
                        <div class="row">
                            <div class="col-lg-6 col-md-12">
                                <div class="form-group mb-3">
                                    <label>Password</label>
                                    <input class="form-control" type="password" name="password" id="register-password" placeholder="Password" required>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12">
                                <div class="form-group mb-3">
                                    <label>Confirm Password</label>
                                    <input class="form-control" type="password" name="confirmPassword" id="register-confirm-password" placeholder="Confirm Password" required>
                                </div>
                            </div>
                        </div>


                        <div class="form-group mt-4 w-50 mx-auto">
                            <input type="submit" class="btn btn-warning" id="register-btn" name="register" value="Register">
                        </div>
                        <div class="form-group mt-2">
                            <p>Already have an Account? <a id="login-url" href="login.php"> Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
            <div class=" col-lg-6 col-sm-12 d-flex justify-content-start  card card-description-register">
                <div class="container mt-5">
                    <h1 class="h1-infoforge">InfoForge</h1>
                    <p class="p-infoforge">Build a pc, Browse, Shop.</p>
                </div>
            </div>
        </div>
    </div>
    </div>


</section>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>


<!-- Verification Modal -->
<div class="modal fade" id="verificationModal" tabindex="-1" role="dialog" aria-labelledby="verificationModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="verificationModalLabel">Enter Verification Code</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="verify.php">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="verificationCode">Verification Code</label>
                        <input type="text" class="form-control" name="verification_code" placeholder="Enter code" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php if (isset($_SESSION['show_modal']) && $_SESSION['show_modal'] === true): ?>
    <script>
        $(document).ready(function() {
            $('#verificationModal').modal('show');
        });
    </script>
    <?php unset($_SESSION['show_modal']); ?>
<?php endif; ?>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>