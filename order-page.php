<?php
session_start();
include('server/connection.php');

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


?>
<?php include('layouts/header.php'); ?>

<!-- Orders -->
<div class="container-fluid pt-5 mt-5">
    <div class="ms-5 mt-5">
        <h1 class="sage-color">My Orders</h1>
    </div>

    <hr class="w-100">

    <!-- Responsive Navigation -->
    <div class="d-flex justify-content-start align-items-center mt-5 account-nav flex-nowrap overflow-auto">
        <div class="p-3 flex-shrink-0 pe-5 ">
            <h3 class="fw-normal" onclick="window.location.href='account.php'">My Account</h3>
        </div>
        <div class="p-3 flex-shrink-0 pe-5 selected-nav">
            <h3 class="fw-normal" onclick="window.location.href='order-page.php'">My Orders</h3>
        </div>
        <!-- <div class="p-3 flex-shrink-0 pe-5 ">
            <h3 class="fw-normal">Change Password</h3>
        </div> -->
    </div>
</div>

<section id="orders" class="orders container mt-5 overflow-x-auto w-auto gray-bg-color">
    <!-- Start of Cart Table -->
    <table class="gray-bg-color">
        <h2 class="sage-color my-4">My Orders</h2>
        <thead class="border-bottom">
            <tr>
                <th class="text-center gray-bg-color sage-color">Order ID</th>
                <th class="text-center gray-bg-color sage-color">Product Name</th>
                <th class="text-center gray-bg-color sage-color">Cost</th>
                <th class="text-center gray-bg-color sage-color">Payment status</th>
                <th class="text-center gray-bg-color sage-color">Delivery Status</th>
                <th class="text-center gray-bg-color sage-color">Date</th>
                <th class="text-center gray-bg-color sage-color">Action</th>
            </tr>
        </thead>
        <tbody>

            <?php include('server/fetch_orders.php') ?>
            <?php while ($row = $orders->fetch_assoc()) { ?>

                <?php if ($row['user_id'] == $_SESSION['user_id']) { ?>
                    <tr>
                        <td><span><?php echo $row['order_id']; ?></span></td>
                        <td><span><?php echo $row['product_name']; ?></span></td>
                        <td><span>₱<?php echo number_format($row['order_cost'], 2); ?></span></td>
                        <td><span><?php echo $row['order_status']; ?></span></td>
                        <td class="text-center">
                            <span>
                                <?php
                                // Check if 'delivery_status' is set and not empty
                                echo isset($row['delivery_status']) && !empty($row['delivery_status']) ? $row['delivery_status'] : 'Preparing';
                                ?>
                            </span>
                        </td>
                        <td class="text-center"><span><?php echo $row['order_date']; ?></span></td>
                        <td>
                            <form method="POST" action="orders_details.php" class="d-flex justify-content-center">
                                <input type="hidden" value="<?php echo $row['order_status']; ?>" name="order_status" />
                                <input type="hidden" value="<?php echo $row['order_id']; ?>" name="order_id" />
                                <!-- <input type="submit" name="order_details_btn" class="btn btn-custom border-none" id="checkout-btn" value="Details" /> -->
                            </form>
                        </td>
                    </tr>
                <?php } ?>
            <?php } ?>
        </tbody>

    </table>
</section>
<!-- end of Cart Table -->
<section id="orders" class="orders container mt-5 overflow-x-auto w-auto gray-bg-color">
    <h2 class="sage-color my-4">PC Build Orders</h2>
    <?php include('server/fetch_orders.php') ?>

    <table class="gray-bg-color">
        <thead class="border-bottom">
            <tr>
                <th class="text-center gray-bg-color sage-color">Order ID</th>
                <th class="text-center gray-bg-color sage-color">Product Name</th>
                <th class="text-center gray-bg-color sage-color">Cost</th>
                <th class="text-center gray-bg-color sage-color">Status</th>
                <th class="text-center gray-bg-color sage-color">Delivery Status</th>
                <th class="text-center gray-bg-color sage-color">Date</th>
                <th class="text-center gray-bg-color sage-color">Build Details</th>
            </tr>
        </thead>
        <?php while ($row = $pc_orders->fetch_assoc()) { ?>
            <?php if ($row['user_id'] == $_SESSION['user_id']) { ?>
                <!-- STart of PC orders Table -->
                <tbody>
                    <tr>
                        <td><span><?php echo $row['order_id']; ?></span></td>
                        <td><span><?php echo $row['product_name']; ?></span></td>
                        <td><span>₱<?php echo number_format($row['order_cost'], 2); ?></span></td>
                        <td><span><?php echo $row['order_status']; ?></span></td>
                        <td><span><?php echo $row['delivery_status']; ?></span></td>
                        <td><span><?php echo $row['order_date']; ?></span></td>
                        <td>
                            <textarea class="form-control" id="prodDescArea" rows="7"><?= htmlspecialchars($row['components']) ?></textarea>
                        </td>
                    </tr>
                <?php } ?>
            <?php } ?>
                </tbody>
    </table>
    <!-- end of pC orders Table -->
</section>

<?php include('layouts/footer.php'); ?>




<script>
    const notificationModal = document.createElement("div");
    notificationModal.innerHTML = `
        <div id="notification-modal" class="modal">
            <div class="modal-content">
            <span class="modal-message"></span>
            </div>
        </div>
        `;
    document.body.appendChild(notificationModal);

    const modal = document.getElementById("notification-modal");
    const modalMessage = modal.querySelector(".modal-message");

    const showNotification = (message) => {
        modalMessage.textContent = message;
        modal.style.display = "block";
    };

    const hideNotification = () => {
        modal.style.display = "none";
    };

    // Function to get query parameters from the URL
    const getUrlParameter = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Check if 'payment_message' exists in the URL
    const paymentMessage = getUrlParameter('payment_message');

    // If 'payment_message' exists, show the modal with the message
    if (paymentMessage) {
        showNotification(paymentMessage);

        // Optionally, hide the notification after some time
        setTimeout(hideNotification, 5000); // Hides after 5 seconds
    }
</script>