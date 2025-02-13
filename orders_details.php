<?php
ini_set('display_errors', 0); // Disable displaying errors
ini_set('log_errors', 1); // Enable logging errors 
session_start();
include('server/connection.php');

$order_details = [];
$table_source = '';



if (isset($_POST['order_details_btn']) && isset($_POST['order_id'])) {
    $order_id = $_POST['order_id'];
    $order_status = $_POST['order_status'];

    // Fetch from the orders table
    $stmt = $conn->prepare("SELECT * FROM orders WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $order_details = $stmt->get_result();
    $table_source = 'orders'; // Track the source

    // If not found in the orders table, check the pc_cart table
    if ($order_details->num_rows === 0) {
        $stmt = $conn->prepare("SELECT * FROM pc_cart WHERE order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $pc_order_details = $stmt->get_result();
        $table_source = 'pc_cart';

        $res = $pc_order_details->fetch_assoc(); // Fetches the first row

        if ($res) {
            $case = $res['case'];
            $mobo = $res['Motherboard'];
            $cpu = $res['CPU'];
            $psu = $res['psu'];
            $storage = $res['Storage'];
            $ram = $res['ram'];
            $gpu = $res['GPU'];


            // Prepare build info (you can map build info as needed)
            $buildInfo = [
                'case' => $case,
                'Motherboard' => $mobo,
                'CPU' => $cpu,
                'psu' => $psu,
                'Storage' => $storage,
                'ram' => $ram,
                'GPU' => $gpu
            ];
        }

        $buildInfoStr = "";
        foreach ($buildInfo as $component => $value) {
            $buildInfoStr .= "$component: $value\n";
        }



        if ($pc_order_details->num_rows > 0) {
            $order_details = $pc_order_details;
        } else {
            // Redirect if not found in either table
            header('Location: account.php');
            exit();
        }
    }
} else {
    header('Location: account.php');
    exit();
}

function calculateTotalOrderPrice($order_details)
{
    $total = 0;
    foreach ($order_details as $row) {
        $product_price = $row['product_price'];
        $product_quantity = $row['order_quantity'];
        $total += $product_price * $product_quantity;
    }
    return $total;
}
?>
<?php include('layouts/header.php'); ?>

<section id="orders" class="orders container my-5 py-3">
    <div class="container mt-5">
        <h2 class="font-weight-bold text-center">Order Details</h2>
        <hr class="mx-auto">
    </div>
    <?php if ($table_source === 'orders') { ?>
        <?php foreach ($order_details as $row) { ?>
            <table class="mt-5 pt-5">
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <td class="product_name">
                        <span><?php echo $row['product_name']; ?></span>
                    </td>
                    <td class="order_price">
                        <span>₱<?php echo number_format($row['order_cost'], 2); ?></span> <!-- Changed to product_price for consistency -->
                    </td>
                    <td class="order_quantity">
                        <span><?php echo $row['order_quantity']; ?></span>
                    </td>
                    <td class="order_status">
                        <span><?php echo $row['order_status']; ?></span>
                    </td>
                    <td>
                        <?php if ($row['order_status'] == 'not yet paid') { ?>
                            <button id="paynow" style="float: right;" type="submit" name="order_pay_btn" class="paynow btn btn-primary">Pay Now</button>
                        <?php } else { ?>
                            <span>Alread Paid</span>
                        <?php } ?>
                    </td>
                </tr>
            <?php } ?>
        <?php } ?>
        <?php if ($table_source === 'pc_cart') { ?>
            <?php foreach ($order_details as $row) { ?>
                <table class="mt-5 pt-5">
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Build Information</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        <td class="product_name">
                            <span><?php echo $row['build_name']; ?></span>
                        </td>
                        <td class="order_price">
                            <span>₱<?php echo number_format($row['Total_price'], 2); ?></span> <!-- Changed to product_price for consistency -->
                        </td>
                        <td class="order_quantity">
                            <textarea class="form-control" id="prodDescArea" rows="7"><?= htmlspecialchars($buildInfoStr) ?></textarea>
                        </td>
                        <td class="order_status">
                            <span><?php echo $row['order_status']; ?></span>
                        </td>
                        <td>
                            <?php if ($row['order_status'] == 'not yet paid') { ?>
                                <button id="paynow" style="float: right;" type="submit" name="order_pay_btn" class="paynow btn btn-primary">Pay Now</button>
                            <?php } else { ?>
                                <!-- No button displayed -->
                            <?php } ?>
                        </td>
                    </tr>
                <?php } ?>
            <?php } ?>
                </table>
</section>


<!-- SKWIPS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>


<script>
    $(document).ready(function() {
        $('#paynow').on('click', function(e) {
            targetElement = e.target;
            var table = "<?php echo $table_source; ?>";
            var row = $(this).closest('tr'); // Get the closest row
            var order_id = "<?php echo $order_id; ?>"; // get order_id from PHP
            console.log(order_id);

            // Check for the correct source table and extract data accordingly
            var product_name = row.find('.product_name span').text();
            var order_price, order_quantity, order_status;



            if (table === 'pc_cart') {
                // If the source is 'pc_cart'
                order_price = parseFloat(row.find('.order_price span').text().replace('₱', '').replace(',', ''));
                order_quantity = 1;
                order_status = row.find('.order_status span').text();
            } else {
                // If the source is 'orders'
                order_price = parseFloat(row.find('.order_price span').text().replace('₱', ''));
                order_quantity = parseFloat(row.find('.order_quantity span').text());
                order_status = row.find('.order_status span').text();
            }

            var total = order_price * order_quantity;

            console.log(order_price, order_quantity, order_status);
            $.ajax({
                url: 'payment.php',
                method: 'POST',
                data: {
                    ID: order_id,
                    prod_name: product_name,
                    ordPrice: order_price,
                    ordQuantity: order_quantity,
                    orderStat: order_status,
                    orderTotal: total,
                },
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    if (response.status === 'success') {
                        console.log(response.message);
                    } else {
                        console.log('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.log('An error occurred: ' + error);
                }
            });

        });
    });
</script>
<!-- Footer -->
<?php include('layouts/footer.php'); ?>