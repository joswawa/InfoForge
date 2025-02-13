<?php
session_start();
// Include database connection
include('server/connection.php');

// Ensure the user is logged in and has a valid role
if (isset($_SESSION['role'])) {
    if ($_SESSION['role'] === 'user') {
        $user_email = $_SESSION['user_email'];
        $user_id = $_SESSION['user_id'];
    } elseif ($_SESSION['role'] === 'admin') {
        $user_email = $_SESSION['admin_email'];
        $user_id = $_SESSION['admin_id'];
    } else {
        // If role is undefined or invalid, redirect to login
        header('Location: login.php');
        exit;
    }
} else {
    // Redirect to login if the user is not logged in
    header('Location: login.php');
    exit;
}

// Ensure 'selected_cart' and 'selected_total' are available in the session
if (!isset($_SESSION['selected_cart']) || !isset($_SESSION['selected_total'])) {
    echo '<script>alert("No items selected for checkout.");window.location.href="cart.php";</script>';
    exit;
} else {
    foreach ($_SESSION['selected_cart'] as $selected_item) {
        $item = $selected_item['id'];  // Access the product id
        $query = "SELECT quantity, product_name FROM cart WHERE id = ? AND user_id = ?";

        // echo 'console.log("Products: ' . json_encode($item) . '");';
        // die;
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('ii', $item, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $quan = $row['quantity'];
                $name = $row['product_name'];
                // echo '<script>console.log("fdsfasd' . $quan . '", "' . $name . '");</script>';
            } else {
                $quan = 0; // Default value if no result found
            }

            $stmt->close();
        }
    }
    // PC cart
    foreach ($_SESSION['selected_cart'] as $selected_item) {
        $item = $selected_item['id'];  // Access the product id
        // echo '<script>alert("The ORder ID: ' . $item . '");</script>';
        // die;
        $query = "SELECT build_name FROM pc_cart WHERE order_id = ? AND user_id = ?";

        // echo '<script>console.log("' . json_encode($selected_item) . '");</script>';

        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('ii', $item, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $quan = 1;
                $name = $row['build_name'];
            } else {
                $quan = 0; // Default value if no result found
            }

            $stmt->close();
        }
    }
}
// echo '<script>console.log("' . $quan . '", "' . $name . '");</script>';



// Extract data from the session
$product_IDS = $_SESSION['order_ids'];
// echo 'console.log("Products: ' . json_encode($product_IDS) . '");';
// die;
$selected_cart = $_SESSION['selected_cart'];
$selected_total = $_SESSION['selected_total'];



// If the user is logged in, fetch additional details from the database (like address, etc.)
$query = "SELECT * FROM users WHERE id = ?";
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the user exists in the users table
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $userName = $user['name'];
        $user_email = $user['email'];
        $user_address = $user['address'] ?? 'Tanza, Cavite'; // Use stored address or default
    } else {
        // If not found in users table, check the admin table
        $query = "SELECT * FROM admintable WHERE ID = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('i', $user_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $admin = $result->fetch_assoc();
                $fullName = $admin['first_name'] . ' ' . $admin['last_name'];
                $user_email = $admin['email'];
                $user_address = 'Tanza, Cavite'; // Set a default address for admins if not available
            } else {
                // If no user is found in both tables
                echo "No user found.";
                exit();
            }
        } else {
            echo "Error in admin query preparation: " . $conn->error;
            exit();
        }
    }
    $stmt->close();
} else {
    echo "Error in query preparation: " . $conn->error;
    exit();
}

// Store user data in session for use in the form
$_SESSION['user_name'] = $userName;
$_SESSION['user_email'] = $user_email;
$_SESSION['user_address'] = $user_address;
?>

<!-- Header -->
<?php include('layouts/header.php'); ?>

<!-- CHECKOUT -->
<div class="container-fluid pt-5">
    <h1 class="fw-bold mt-5 sage-color pt-5 ms-5">Check out</h1>
    <hr class="w-100">

    <!-- Responsive Navigation -->
    <div class="d-flex justify-content-start align-items-center mt-5 account-nav flex-nowrap overflow-auto">
        <div class="p-3 flex-shrink-0 pe-5">
            <h3 class="fw-normal" onclick="window.location.href='cart.php'">Your Cart</h3>
        </div>
        <div class="p-3 flex-shrink-0 pe-5 selected-nav">
            <h3 class="fw-normal" onclick="window.location.href='checkout.php'">Checkout</h3>
        </div>
        <div class="p-3 flex-shrink-0 pe-5 ">
            <h3 class="fw-normal">Payment</h3>
        </div>
    </div>
</div>
<div class="mx-auto container mt-3">
    <div class="row">
        <div class="col-lg-6 col-md-12">
            <form id="checkout-form" method="POST" action="server/place_order.php">
                <p class="text-center" style="color: red;">
                    <?php if (isset($_GET['message'])) {
                        echo $_GET['message'];
                    } ?>
                </p>

                <div class="form-group mb-4">
                    <label>*Name</label>
                    <input type="text" class="form-control" id="checkout-name" name="name" placeholder="Name" value="<?php echo $_SESSION['user_name']; ?>" required>
                </div>
                <div class="form-group mb-4">
                    <label>*Email</label>
                    <input type="email" class="form-control" id="checkout-email" name="email" placeholder="Email" value="<?php echo $_SESSION['user_email']; ?>" required>
                </div>
                <div class="form-group mb-4">
                    <label>*Phone</label>
                    <input type="tel" class="form-control" id="checkout-phone" name="phone" placeholder="Phone" required>
                </div>
                <div class="form-group mb-4">
                    <label>*Address</label>
                    <input type="text" class="form-control" id="checkout-address" name="address" placeholder="Address" value="<?php echo $_SESSION['user_address']; ?>" required>
                </div>
        </div>

        <div class="col-lg-6 col-md-12 order-summary-div">
            <div class="container-fluid h-100 d-flex flex-column justify-content-between">
                <div>
                    <h2 class="mb-4 sage-color mt-3">Order Summary</h2>
                    <hr class="w-100">
                    <div class="cart-items">
                        <?php
                        if (!empty($selected_cart)) {
                            foreach ($selected_cart as $product) {
                                // Compute subtotal for each product
                                $subtotal = $product['price'] * $product['quantity'];
                                echo '
                                    <div class="cart-item mb-3">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="product-info">
                                                <h6 class="mb-0 fw-bold sage-color me-2">' . htmlspecialchars($product['product_name']) . '</h6>
                                                <p class="mb-0 gray-color">(₱' . number_format($product['price'], 2) . ' x ' . $product['quantity'] . ')</p>
                                            </div>
                                            <div class="product-total">
                                                <p class="mb-0 fw-bold">₱ ' . number_format($subtotal, 2) . '</p>
                                            </div>
                                        </div>
                                    </div>';
                            }
                        } else {
                            echo '<p>No products selected for checkout.</p>';
                        }
                        ?>
                    </div>
                    <hr class="w-100">
                </div>

                <!-- Total and Checkout Button -->
                <div class="form-group checkout-btn-container d-flex flex-column mb-5 align-items-end">
                    <p class="fw-bold">Total: ₱ <?php echo number_format($selected_total, 2); ?></p>

                    <?php
                    // Prepare product details to pass in the form
                    $productDetails = [];
                    foreach ($selected_cart as $product) {
                        $productDetails[] = $product['product_name'] . ' (₱' . number_format($product['price'], 2) . ')';
                    }
                    $productDetailsString = implode(', ', $productDetails);
                    ?>
                    <!-- <script>
                        alert("PC build: <?php echo $productDetailsString; ?>");
                    </script>; -->
                    <input type="hidden" class="form-control" id="product_details" name="product_details" value="<?php echo htmlspecialchars($productDetailsString); ?>">
                    <input type="hidden" class="form-control" id="userID" name="userID" value="<?php echo $user_id; ?>">
                    <input type="hidden" class="form-control" id="prodIDS" name="prodIDS" value="<?php echo $product_IDS; ?>">
                    <input type="submit" class="btn" id="checkout-btn" name="place_order" value="Place Order">
                </div>
            </div>
        </div>
        </form>

    </div>
</div>
</section>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>



<!-- Loading Modal -->
<div class="modal" id="loadingModal" tabindex="-1" aria-labelledby="loadingModalLabel" aria-hidden="true">
    <div class="modal-dialog d-flex justify-content-center align-items-center">
        <div class="modal-content">
            <div class="modal-body text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Processing your order...</p>
            </div>
        </div>
    </div>
</div>


<script>
    // Show the loading modal before the form is submitted
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        // Show the loading modal
        $('#loadingModal').modal('show');
    });
</script>