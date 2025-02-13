<?php
session_start();
include('server/connection.php');
include('server/mail.php');
// include('mail.php');

// Check if the user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Check if role is set in the session
if (!isset($_SESSION['role'])) {
    header('Location: login.php'); // Or you can redirect them to an error page
    exit;
}

if ($_SESSION['role'] === 'user') {
    $user_email = $_SESSION['user_email'];
} elseif ($_SESSION['role'] === 'admin') {
    $user_email = $_SESSION['admin_email'];
} else {
    // If role is undefined or invalid, redirect to login or an error page
    header('Location: login.php');
    exit;
}
$user_role = $_SESSION['role']; // Assuming user role is stored in session

// Get user verification status from the database
$stmt = $conn->prepare("SELECT id ,is_verified FROM users WHERE email = ?");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$_SESSION['user_id'] = $user['id'];

// Handle password change request
if (isset($_POST['change_password'])) {
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Password validation
    if ($password !== $confirmPassword) {
        header('location: account.php?error=Passwords do not match');
        exit;
    } elseif (strlen($password) < 6) {
        header('location: account.php?error=Password must be at least 6 characters');
        exit;
    } else {
        $hash_password = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $conn->prepare("UPDATE users SET password=? WHERE email=?");
        $stmt->bind_param('ss', $hash_password, $user_email);

        if ($stmt->execute()) {
            header('location: account.php?message=Password updated successfully');
        } else {
            header('location: account.php?error=Could not update password');
        }
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('location: login.php');
    exit;
}
?>
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<!-- Header -->
<?php include('layouts/header.php'); ?>

<!-- Account Section -->
<section class="my-5 py-5">


    <div class="container-fluid pt-5">
        <div class="ms-5">
            <h1 class="sage-color">Welcome back, <?php echo isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Guest'; ?></h1>
        </div>

        <hr class="w-100">

        <!-- Responsive Navigation -->
        <div class="d-flex justify-content-start align-items-center mt-5 account-nav flex-nowrap overflow-auto">
            <div class="p-3 flex-shrink-0 pe-5 selected-nav">
                <h3 class="fw-normal" onclick="window.location.href='account.php'">My Account</h3>
            </div>
            <div class="p-3 flex-shrink-0 pe-5 ">
                <h3 class="fw-normal" onclick="window.location.href='order-page.php'">My Orders</h3>
            </div>
            <!-- <div class="p-3 flex-shrink-0 pe-5 ">
                <h3 class="fw-normal changePasswordLink" value="Change Password" id="changePasswordLink">Change Password</h3>
            </div> -->
        </div>
    </div>


    <!-- Account Info -->
    <div class="mt-3 pt-5 container">
        <p class="" style="color:green">
            <?php if (isset($_GET['register_success'])) {
                echo $_GET['register_success'];
            } ?>
        </p>
        <p class="" style="color:green">
            <?php if (isset($_GET['login_success'])) {
                echo $_GET['login_success'];
            } ?>
        </p>
        <p class="text-center" style="color:green">
            <?php if (isset($_GET['verification_success'])) {
                echo $_GET['verification_success'];
            } ?>
        </p>
        <h1 class="font-weight-bold gray-color">Personal Details</h1>
        <hr class="w-100 mb-5">
        <div class="account-info mt-3">
            <?php if ($user_role === 'admin') { ?>
                <p>Name: <span> <?php echo isset($_SESSION['admin_name']) ? ucwords($_SESSION['admin_name']) : ''; ?> </span></p>
                <p>Email: <span> <?php echo $_SESSION['admin_email'] ?? ''; ?></span></p>
                <p style="color: green;">Admin</p>
                <p><a href="#orders" id="orders-btn" class="text-primary">Orders</a></p>
                <p><a href="account.php?logout=1" id="logout-btn" class="text-danger">Logout</a></p>

            <?php } ?>
            <!-- Verify Account Link or Verified/Admin Text -->
            <?php if ($user_role === 'user') { ?>
                <h4 class="mb-4">Name: <span class="ms-5"> <?php echo isset($_SESSION['user_name']) ? ucwords($_SESSION['user_name']) : ''; ?> </span></h4>
                <h4 class="mb-5">Email: <span class="ms-5"> <?php echo $_SESSION['user_email'] ?? ''; ?></span></h4>
                <hr class="w-100 mb-5">
                <?php if ($user['is_verified'] == 0) { ?>
                    <h4><a href="#" id="verify-link" style="color: #fca554; text-decoration: none;" data-toggle="modal" data-target="#verificationModal">Verify Account</a></p>
                        <h4><a href="account.php?logout=1" id="logout-btn" class="text-danger">Logout</a></p>
                        <?php } else { ?>
                            <h4 style="color: green;">Verified</h4>

                            <p><a href="#orders" id="orders-btn" class="text-primary">Your orders</a></p>
                            <h4><a href="account.php?logout=1" id="logout-btn" class="text-danger">Logout</a></h4>
                        <?php } ?>
                    <?php } ?>
        </div>

    </div>
    <!-- Change Password Form  -->
    <?php if ($_SESSION['role'] === 'user') { ?>
        <div class="col-lg-6 col-md-12 col-sm-12">

        </div>
    <?php } elseif ($_SESSION['role'] === 'admin') { ?>
        <div class="col-lg-6 col-md-12 col-sm-12">
            <form id="account-form" method="POST" action="account.php">
                <p class="text-center" style="color:red"><?php if (isset($_GET['error'])) {
                                                                echo $_GET['error'];
                                                            } ?></p>
                <p class="text-center" style="color:green"><?php if (isset($_GET['message'])) {
                                                                echo $_GET['message'];
                                                            } ?></p>
                <h3 class="font-weight-bold">Admin Dashboard</h3>
                <hr class="mx-auto">
                <div class="form-group mt-4">
                    <a href="http://localhost/InventoryManagementSystem/IMS_dashboard.php" class="btn btn-primary">Go to Admin Dashboard</a>
                </div>
            <?php } ?>

            <!-- <iframe id="preview-frame" src="http://localhost/InventoryManagementSystem/IMS_dashboard.php" width="100%" height="200px" style="border: none;"></iframe> -->
        </div>
</section>
<!-- Footer -->
<?php include('layouts/footer.php'); ?>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

<script>
    $(document).ready(function() {
        $('#verify-link').click(function(e) {
            e.preventDefault(); // Prevent default link behavior

            // Show a loading state (optional)
            $('#verify-link').text('Sending...').prop('disabled', true);

            // Make AJAX request to generate verification code
            $.ajax({
                url: 'account.php', // The current page
                type: 'POST',
                data: {
                    action: 'generate_verification_code'
                },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        alert(response.message);
                        $('#verificationModal').modal('show');
                    } else {
                        alert(response.message);
                    }
                },
                error: function() {

                    console.log()
                    alert('An error occurred while processing your request.');
                },
                complete: function() {
                    // Reset the button state
                    $('#verify-link').text('Verify Account').prop('disabled', false);
                }
            });
        });
    });
</script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        $(document).ready(function() {
            $('#changePasswordLink').click(function(e) {

                console.log("Na cclick pre");
                e.preventDefault(); // Prevent default link behavior

                // Initialize the modal with static backdrop programmatically
                var myModal = new bootstrap.Modal(document.getElementById('changePasswordModal'), {
                    backdrop: false, // Keeps the backdrop active (you can change this to 'false' to disable)
                    keyboard: false
                });

                // Show the modal
                myModal.show();

                $('#closeModel').click(function() {
                    myModal.hide();
                });

                // When the "Change Password" button is clicked, keep the modal open
                $('#change-pass-btn').click(function() {
                    // You can add logic here to handle the form submission or display a message

                    // After a few seconds (3 seconds), close the modal automatically
                    setTimeout(function() {
                        myModal.hide();
                    }, 3000); // 3000ms = 3 seconds
                });
            });
        });
    });
</script>