<?php
session_start();
include('server/connection.php');

// If user has already logged in, redirect based on role
if (isset($_SESSION['logged_in'])) {
    if ($_SESSION['role'] === 'user') {
        header('location: account.php');
    } elseif ($_SESSION['role'] === 'admin') {
        header('location: http://localhost/InventoryManagementSystem/IMS_dashboard.php?login_success=logged in successfully');
    }
    exit;
}

if (isset($_POST['login_btn'])) {
    $email = $_POST['email'];
    $entered_password = $_POST['password'];

    // Query to check user in the `users` table by email
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param('s', $email);

    if ($stmt->execute()) {
        $stmt->bind_result($user_id, $user_name, $user_email, $hashed_password);
        $stmt->store_result();

        if ($stmt->num_rows == 1) {
            $stmt->fetch();

            // Verify the entered password with the hashed password from the database
            if (password_verify($entered_password, $hashed_password)) {
                // Password is correct, set session variables
                $_SESSION['user_id'] = $user_id;
                $_SESSION['user_name'] = $user_name;
                $_SESSION['user_email'] = $user_email;
                $_SESSION['logged_in'] = true;
                $_SESSION['role'] = 'user'; // Set role as user

                header('location: index.php?login_success=logged in successfully');
                exit;
            } else {
                // Invalid password
                header('location: login.php?error=Invalid Email or Password');
                exit;
            }
        }
    }

    // If not found in `users`, check the `admin` table
    $stmt = $conn->prepare("SELECT ID, first_name, last_name, email, password, profile_picture FROM admintable WHERE email = ? LIMIT 1");
    $stmt->bind_param('s', $email);

    if ($stmt->execute()) {
        $stmt->bind_result($admin_id, $admin_Fname, $admin_Lname, $admin_email, $hashed_password, $profile_picture);
        $stmt->store_result();

        if ($stmt->num_rows == 1) {
            $stmt->fetch();

            // Verify the entered password with the hashed password from the database
            if (password_verify($entered_password, $hashed_password)) {
                // Concatenate first and last name
                $admin_name = $admin_Fname . ' ' . $admin_Lname;

                // Handle the profile picture (BLOB) data
                if ($profile_picture) {
                    $_SESSION['profile_picture'] = $profile_picture; // Store the binary image data in the session
                } else {
                    $_SESSION['profile_picture'] = null; // Fallback if no profile picture is set
                }

                // Continue with the login process
                $_SESSION['admin_id'] = $admin_id;
                $_SESSION['admin_name'] = $admin_name;
                $_SESSION['admin_email'] = $admin_email;
                $_SESSION['logged_in'] = true;
                $_SESSION['role'] = 'admin'; // Set role as admin

                header('location: http://localhost/InventoryManagementSystem/IMS_dashboard.php?login_success=logged in successfully');
                exit;
            } else {
                // Invalid password
                header('location: login.php?error=Invalid Email or Password');
                exit;
            }
        } else {
            // No admin found
            header('location: login.php?error=Invalid Email or Password');
            exit;
        }
    } else {
        // Error with query execution
        header('location: login.php?error=something went wrong');
        exit;
    }
}

?>

<!-- Header -->
<?php include('layouts/header.php'); ?>

<!-- LOGIN -->
<section class=" d-flex align-items-center min-vh-100 login-section">
    <div class="container mt-5 form-grid">
        <div class="row g-0 mt-5" id="form-grid">
            <div class="  col-lg-6 col-sm-12 d-flex align-items-center justify-content-start">
                <div class="w-100 py-5 px-5 text-center card card-form">
                    <div class="container text-center ">
                        <h2 class="form-weight-bold">Login</h2>
                        <!-- <hr class="mx-auto"> -->
                    </div>
                    <form id="login-form" method="POST" action="login.php">
                        <p style="color: red" class="text-center">
                            <?php if (isset($_GET['error'])) {
                                echo $_GET['error'];
                            } ?></p>
                        <div class="form-group">
                            <label for="login-email"><span>Email</span></label>
                            <input class="form-control" type="email" name="email" id="login-email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input class="form-control" type="password" name="password" id="login-password"
                                placeholder="Password" required>
                        </div>
                        <div class="form-group mt-3">
                            <input class="btn btn-primary" id="login-btn" type="submit" name="login_btn" value="Login">
                        </div>
                        <div class="form-group mt-3">
                            <p>Don't have an account? <a id="register-url" href="register.php" class="btn">Sign up here!</a></p>
                        </div>
                        <div class="form-group mt-3">
                            <p>Forget Password? <a id="forgetpass-url" href="forget_pass.php" class="btn sage-color">Click here!</a></p>
                        </div>
                    </form>
                </div>
            </div>
            <div class=" col-lg-6 col-sm-12 d-flex justify-content-start  card card-description">
                <div class="container mt-5">
                    <h1 class="h1-infoforge">InfoForge</h1>
                    <p class="p-infoforge">Build a pc, Browse, Shop.</p>
                </div>
            </div>
        </div>
    </div>
    </div>


</section>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>