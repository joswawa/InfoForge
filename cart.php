<?php
session_start();
include('server/connection.php'); // Include the database connection file

// Redirect if user is not logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Redirect if role is not set
if (!isset($_SESSION['role'])) {
    header('Location: login.php'); // Or you can redirect them to an error page
    exit;
}

// Fetch the correct user_id from session (user or admin)
$user_id = $_SESSION['user_id'] ?? $_SESSION['admin_id'] ?? null;

if (!$user_id) {
    echo "Error: User not logged in.";
    exit;
}

// Fetch cart items from the database for the logged-in user
$stmt = $conn->prepare("SELECT c.*, p.product_img1, c.quantity AS order_quantity, p.quantity AS stock_quantity, p.price AS product_price
                        FROM cart c
                        JOIN products_previous p ON c.product_name COLLATE utf8mb4_unicode_ci = p.product_name COLLATE utf8mb4_unicode_ci
                        WHERE c.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart_items = [];
while ($row = $result->fetch_assoc()) {
    $cart_items[] = $row;
}

// Fetch pc_cart items from the database for the logged-in user
$stmt = $conn->prepare("SELECT * FROM pc_cart WHERE user_id = ?");
$stmt->bind_param("i", $user_id); // Bind the user_id

// Execute the query
$stmt->execute();
$result = $stmt->get_result();
$PCcart_items = [];
$pc_components = [];
while ($row = $result->fetch_assoc()) {
    $PCcart_items[] = $row;

    $pc_components = [
        'case' => $row['case'],
        'motherboard' => $row['Motherboard'],
        'CPU' => $row['CPU'],
        'psu' => $row['psu'],
        'Storage' => $row['Storage'],
        'ram' => $row['ram'],
        'GPU' => $row['GPU'],
        'eee' => $row['order_id'],

    ];
}

// print_r($PCcart_items);
// die;


$stmt->close();

// Handle Checkout Button
if (isset($_POST['checkout_selected'])) {
    if (!empty($_POST['selected_products'])) {
        $selected_products = $_POST['selected_products'];
        $selectedIDs = [];
        $selected_cart = [];
        $selected_total = 0; // Initialize total
        $error = false; // Initialize error flag for stock check
        $newQuantity = $_POST['product_quantity'] ?? 1;


        foreach ($selected_products as $product_id) {
            foreach ($cart_items as $item) {
                if ($item['id'] == $product_id) {
                    // Check if the order quantity exceeds stock quantity
                    if ($item['order_quantity'] > $item['stock_quantity']) {
                        echo '<script>alert("The quantity for ' . $item['product_name'] . ' exceeds available stock.");</script>';
                        $error = true;
                        break; // Break the inner loop if stock is insufficient
                    }

                    // Proceed if stock is sufficient
                    $_SESSION['user_id'] = $item['user_id'];
                    $selected_cart[] = [
                        'id' => $item['id'],
                        'user_id' => $item['user_id'],
                        'product_name' => $item['product_name'],
                        'quantity' => $item['order_quantity'], // You may want to check or adjust this quantity too
                        'price' => $item['price']
                    ];
                    $selectedIDs[] = [
                        'id' => $item['id'],
                    ];
                    $selected_total += $item['price'] * $item['order_quantity'];
                }
            }
            foreach ($PCcart_items as $items) {
                // echo '<script>alert("The PC price: ' . $items['order_id'] . '");</script>';
                // die;
                $PCBuildPrice = $items['Total_price'];
                if ($items['order_id'] == $product_id) {
                    $_SESSION['user_id'] = $items['user_id'];
                    $selected_cart[] = [
                        'id' => $items['order_id'],
                        'user_id' => $items['user_id'],
                        'product_name' => $items['build_name'],
                        'quantity' => 1, // You may want to check or adjust this quantity too
                        'price' => $items['Total_price']
                    ];
                    $selectedIDs[] = [
                        'id' => $items['order_id'],
                    ];
                    $selected_total += $items['Total_price'] * 1;
                }
            }
            if ($error) {
                break; // Stop processing if there's an error in stock quantity
            }
        }

        // If no error, proceed to checkout
        if (!$error) {
            $_SESSION['selected_cart'] = $selected_cart;
            $_SESSION['selected_total'] = $selected_total;
            $_SESSION['order_ids'] = $selectedIDs;
            // echo 'console.log("Product IDS: ' . json_encode($_SESSION['order_ids']) . '");';
            // die;

            // Redirect to checkout
            header('Location: checkout.php');
            exit;
        }
    } else {
        echo '<script>alert("No items selected for checkout.");</script>';
    }
}


// Handle removing product from cart
if (isset($_POST['remove_product'])) {
    $product_id = $_POST['product_id'];
    $stmt = $conn->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $product_id, $user_id);

    if ($stmt->execute()) {
        // Set a session message for successful deletion
        $_SESSION['message'] = "Product removed from the cart successfully.";
        $_SESSION['msg_type'] = "success";
    } else {
        // Set a session message if deletion fails
        $_SESSION['message'] = "Failed to remove the product from the cart.";
        $_SESSION['msg_type'] = "danger";
    }

    $stmt->close();

    // Redirect back to the cart page or another page
    header("Location: cart.php");
    exit();
}
// Handle removing product from pc_cart
if (isset($_POST['remove_PCproduct'])) {
    $product_id = $_POST['PCproduct_id'];
    // echo '<script>console.log("ID from pc cart: ' . $product_id . '");</script>';
    // die;
    $stmt = $conn->prepare("DELETE FROM pc_cart WHERE order_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $product_id, $user_id);

    if ($stmt->execute()) {
        // Set a session message for successful deletion
        $_SESSION['message'] = "Product removed from the PC cart successfully.";
        $_SESSION['msg_type'] = "success";
    } else {
        // Set a session message if deletion fails
        $_SESSION['message'] = "Failed to remove the product from the PC cart.";
        $_SESSION['msg_type'] = "danger";
    }

    $stmt->close();

    // Redirect back to the cart page or another page
    header("Location: cart.php");
    exit();
}
?>

<style>

</style>

<!-- Header -->
<?php include('layouts/header.php'); ?>

<div class="container-fluid pt-5 mt-3">
    <h1 class="fw-bold mt-5 sage-color pt-5 ms-5">Your Cart</h1>
    <hr class="w-100">

    <!-- Responsive Navigation -->
    <div class="d-flex justify-content-start align-items-center mt-5 account-nav flex-nowrap overflow-auto">
        <div class="p-3 flex-shrink-0 pe-5 selected-nav">
            <h3 class="fw-normal" onclick="window.location.href='cart.php'">Your Cart</h3>
        </div>
        <div class="p-3 flex-shrink-0 pe-5 ">
            <h3 class="fw-normal">Checkout</h3>
        </div>
        <div class="p-3 flex-shrink-0 pe-5 ">
            <h3 class="fw-normal">Payment</h3>
        </div>
    </div>
</div>



<!-- Cart Section -->
<section class="cart container min-vh-100">
    <div class="row mt-5">
        <div class="col-lg-8 col-md-12 gray-bg-color mb-3 h-auto">
            <?php
            if (isset($_SESSION['message'])): ?>
                <div class="alert alert-<?php echo $_SESSION['msg_type']; ?>">
                    <?php
                    echo $_SESSION['message'];
                    unset($_SESSION['message']);  // Clear message after displaying it
                    ?>
                </div>
            <?php endif; ?>
            <div class="cart-container gray-bg-color">
                <?php if (empty($cart_items) && empty($PCcart_items)): ?>
                    <div class="alert alert-warning text-center">
                        Your cart is currently empty. Please add some products to your cart.
                    </div>
                <?php else: ?>
                    <form method="post" action="cart.php">
                        <table class="table table-borderless align-middle">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-left gray-bg-color text-center ">
                                        <!-- <input type="checkbox" id="select-all" /> -->
                                        <!-- <label id="select-all-label" for="select-all">ALL</label> -->
                                    </th>
                                    <th class="text-left gray-bg-color text-center " style="color: black;">PRODUCT</th>
                                    <th class="text-left gray-bg-color text-center " style="color: black;">NAME</th>
                                    <th class="text-left gray-bg-color text-center " style="color: black;">QUANTITY</th>
                                    <th class="text-left gray-bg-color text-center " style="color: black;">PRICE</th>
                                    <th class="text-left gray-bg-color text-center "></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($cart_items as $item): ?>
                                    <tr class="cart-item">
                                        <td class="text-left gray-bg-color">
                                            <input type="checkbox" name="selected_products[]" value="<?php echo $item['id']; ?>" class="select-item" data-price="<?php echo $item['price']; ?>" onclick="updateTotal()" />
                                        </td>
                                        <td class=" text-left gray-bg-color ">
                                            <img src="data:image/jpeg;base64,<?php echo base64_encode($item['product_img1']); ?>" alt="Product Image" class="img-thumbnail" style="width: 80px; height: auto;">

                                        </td>
                                        <td class="text-left gray-bg-color  fw-bold">
                                            <div>
                                                <p class="mb-0"><?php echo $item['product_name']; ?></p>
                                                <!-- <small><span>₱</span><?php echo number_format($item['price'], 2); ?></small> -->
                                            </div>
                                        </td>
                                        <td class="text-left gray-bg-color">
                                            <div class="quantity-buttons">
                                                <input type="number" id="quantity-<?php echo $item['id']; ?>" name="product_quantity" value="<?php echo $item['order_quantity']; ?>" class="form-control text-center mx-2" style="width: 60px;" min="1" max="<?php echo $item['quantity']; ?>">
                                            </div>
                                        </td>
                                        <td class="text-left gray-bg-color  fw-bold">
                                            <span id="prodPrice-<?php echo $item['id']; ?>" data-price="<?php echo $item['product_price']; ?>">₱<?php echo number_format($item['product_price'], 2); ?></span>
                                        </td>
                                        <td class="text-left gray-bg-color">
                                            <form method="post" action="cart.php">
                                                <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                                                <button type="submit" name="remove_product" style="background: none; border: none; color: red; font-size: 18px; cursor: pointer;">&times;</button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                                <?php foreach ($PCcart_items as $items): ?>
                                    <script>
                                        console.log("Item Total Price: ₱<?php echo number_format($items['Total_price']); ?>");
                                    </script>
                                    <tr class="cart-item">
                                        <td class="text-left gray-bg-color">
                                            <input type="checkbox" name="selected_products[]" value="<?php echo $items['order_id']; ?>" class="select-item" data-price="<?php echo $items['Total_price']; ?>" onclick="updateTotal()" />
                                        </td>
                                        <td class=" text-left gray-bg-color ">
                                            <img src="assets/imgs/buildImg.png" alt="Product Image" class="img-thumbnail" style="width: 80px; height: auto;">
                                        </td>
                                        <td class="text-left gray-bg-color fw-bold">
                                            <div>
                                                <p class="mb-0"><?php echo $items['build_name']; ?></p>
                                            </div>
                                        </td>
                                        <td class="text-left gray-bg-color">
                                            <div class="quantity-buttons">
                                                <input type="number" id="quantity-<?php echo $items['order_id']; ?>" name="PCproduct_quantity" value="1" class="form-control text-center mx-2" style="width: 60px;" min="1" max="1">
                                            </div>
                                        </td>
                                        <td class="text-left gray-bg-color  fw-bold">
                                            <span>₱<?php echo number_format((float)$items['Total_price'], 2); ?></span>
                                        </td>
                                        <td class="text-left gray-bg-color">
                                            <form method="post" action="cart.php">
                                                <input type="hidden" name="PCproduct_id" value="<?php echo $items['order_id']; ?>">
                                                <button type="submit" name="remove_PCproduct" style="background: none; border: none; color: red; font-size: 18px; cursor: pointer;">&times;</button>
                                            </form>
                                        </td>

                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-dark w-25 mb-4 sage-btn" name="checkout_selected">CHECK OUT</button>
                        </div>
                    </form>
                <?php endif; ?>
            </div>
        </div>


        <div class="col-lg-4 col-md-12">
            <div class="summary-container w-100 h-auto">
                <h2 class="sage-color">Order Summary</h2>
                <hr class="w-100 hr-cart">
                <div class="d-flex justify-content-between mb-3 sage-color">
                    <span>Subtotal</span>
                    <span>₱<span id="subtotal-price">0.00</span></span> <!-- Display subtotal -->
                </div>
                <div class="d-flex justify-content-between mb-3 sage-color">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <hr class="w-100 hr-cart">
                <div class="d-flex justify-content-between mb-3 sage-color">
                    <strong>Total</strong>
                    <strong>₱<span id="total-price">0.00</span></strong> <!-- Display total -->
                </div>
                <button type="button" class="btn btn-dark w-100 mt-3 sage-btn" onclick="window.location.href='products.php'">
                    CONTINUE SHOPPING</a>
                </button>
            </div>
        </div>
    </div>
</section>


<!-- Footer -->
<?php include('layouts/footer.php'); ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

<script>
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', function() {
            // Get the product ID from the input ID
            let productId = this.id.split('-')[1];
            let newQuantity = this.value;

            // Get the product price from the associated span (example: prodPrice-<productId>)
            let productPrice = parseFloat(document.getElementById("prodPrice-" + productId).dataset.price);

            // Calculate the new total price for this item
            let newTotalPrice = (productPrice * newQuantity).toFixed(2);

            // Update the item total display for this product
            document.getElementById("quantity-" + productId).innerText = "₱" + newTotalPrice;

            // Send the updated quantity to the server via AJAX
            $.ajax({
                url: 'server/update_quantity.php', // Server-side script to handle the update
                method: 'POST',
                data: {
                    product_id: productId,
                    quantity: newQuantity
                },
                success: function(response) {
                    // Handle success (e.g., update the UI, show a message)
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    // Handle error
                    console.error(error);
                }
            });

            // Call the function to update the total price
            updateTotal();
        });
    });

    document.getElementById("select-all").addEventListener("change", function() {
        let checkboxes = document.querySelectorAll(".select-item");
        let subtotalElement = document.getElementById("subtotal-price");
        let itemTotal = document.getElementById("item_total");
        let totalElement = document.getElementById("total-price");
        let newSubtotal = 0;
        let newTotal = 0;

        checkboxes.forEach(function(checkbox) {
            checkbox.checked = this.checked;
            let productPrice = parseFloat(checkbox.dataset.price);
            let productQuantity = parseInt(document.getElementById("quantity-" + checkbox.value).value);
            let productTotal = productPrice * productQuantity;

            if (checkbox.checked) {
                newSubtotal += productTotal;
                newTotal += productTotal;
            }
        });

        subtotalElement.innerText = newSubtotal.toFixed(2);
        totalElement.innerText = newTotal.toFixed(2);
    });

    function updateTotal() {
        let checkboxes = document.querySelectorAll(".select-item");
        let subtotalElement = document.getElementById("subtotal-price");
        let totalElement = document.getElementById("total-price");
        let newSubtotal = 0;
        let newTotal = 0;

        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                let productPrice = parseFloat(checkbox.dataset.price);
                let productQuantity = parseInt(document.getElementById("quantity-" + checkbox.value).value);
                let productTotal = productPrice * productQuantity;
                newSubtotal += productTotal;
                newTotal += productTotal;
            }
        });

        subtotalElement.innerText = newSubtotal.toFixed(2);
        totalElement.innerText = newTotal.toFixed(2);
    }
</script>