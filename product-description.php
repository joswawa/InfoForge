<?php
include('server/connection.php');

if (isset($_GET['product_id'])) {
    $product_id = $_GET['product_id'];
    $stmt = $conn->prepare("SELECT * FROM products_previous WHERE product_id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $products = $stmt->get_result();
} else {
    header('location: index.php');
}
?>

<?php include('layouts/header.php'); ?>

<div class="container back-btn-container mb-3">
    <button class="btn-lg rounded-pill btn-outline-dark border-0 mx-2 mt-3">
        <a href="products.php" class="text-decoration-none fw-bold" style="color: #FFFFE3;">&#8592; Back to Shop</a>
</div>
</button>
<div class="container">
    <div class="row d-flex justify-content-center" id="product-caro">
        <?php while ($row = $products->fetch_assoc()) {
            // Convert image blob data to base64
            $product_img1 = base64_encode($row['product_img1']);
            $product_img2 = base64_encode($row['product_img2']);
            $product_img3 = base64_encode($row['product_img3']);
        ?>
            <div class="col-lg-7 col-sm-12 d-flex justify-content-center d-flex align-items-center">
                <div id="carouselExampleDark" class="carousel carousel-dark slide">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-bs-interval="10000">
                            <div class="image-container">
                                <img src="data:image/jpeg;base64,<?php echo $product_img1; ?>" class="d-block w-100 h-75 img-fluid" alt="Product Image 1">
                            </div>
                        </div>
                        <div class="carousel-item" data-bs-interval="2000">
                            <div class="image-container">
                                <img src="data:image/jpeg;base64,<?php echo $product_img2; ?>" class="d-block w-100 h-75 img-fluid" alt="Product Image 2">
                            </div>
                        </div>
                        <div class="carousel-item">
                            <div class="image-container">
                                <img src="data:image/jpeg;base64,<?php echo $product_img3; ?>" class="d-block w-100 h-75 img-fluid" alt="Product Image 3">
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div class="col-lg-5 col-sm-12 d-flex justify-content-center flex-column" id="product-info-div">
                <h1 class="mb-3 fw-bold ivory-text"><?php echo $row['product_name']; ?></h1>
                <hr class="sp-hr w-100">
                <div>
                    <p class="fw-bold ivory-text">Description:</p>
                    <p class="ivory-text"><?php echo htmlspecialchars($row['product_description']); ?></p>
                </div>

                <div class="d-flex align-items-center mb-4">
                    <form method="POST" action="server/addToCart.php">
                        <input type="hidden" id="product_id" name="product_id" value="<?php echo $row['product_id']; ?>" />
                        <input type="hidden" id="product_image" name="product_image" value="<?php echo $product_img1; ?>" />
                        <input type="hidden" id="product_name" name="product_name" value="<?php echo $row['product_name']; ?>" />
                        <input type="hidden" id="product_price" name="product_price" value="<?php echo $row['price']; ?>" />
                        <label for="product-quantity" class="ivory-text mb-2 fw-bold">Quantity</label>
                        <input type="number" id="product_quantity" name="product_quantity" value="1" min="1" class="form-control mb-5" style="width: 80px;">
                        <h2 class="fw-bold gray-color">₱<?php echo number_format($row['price'], 2); ?></h2>
                        <button class="btn btn-lg btn-outline-dark col-lg-14 fw-bold mt-5 add-to-cart-btn" type="submit" name="add_to_cart" id="add-to-cart-btn">Add to cart</button>
                    </form>
                </div>
            </div>
        <?php } ?>
    </div>
</div>

<section class="categories-section my-5 ">
    <div class="container">
        <h2 class="fw-bold sage-color">More Products</h2>
        <hr class="mb-5">
        <div class="row d-flex justify-content-center gap-3" id="products-grid">
            <?php include('server/get_related_products.php'); ?>
            <?php while ($row = $random_products->fetch_assoc()) {
                // Encode the image data stored in the database (LONGBLOB) to base64
                $product_img = 'data:image/jpeg;base64,' . base64_encode($row['product_img1']);
            ?>
                <div class="product text-center col-lg-3 col-md-4 col-sm-12">
                    <!-- Correct the img tag to include the src attribute -->
                    <img src="<?php echo $product_img; ?>" alt="Product Image" class="img-fluid mb-3 h-50" />

                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h5 class="p-name"><?php echo htmlspecialchars($row['product_name']); ?></h5>
                    <h4 class="p-price ivory-text">₱<?php echo number_format($row['price'], 2); ?></h4>
                    <a href="<?php echo "product-description.php?product_id=" . $row['product_id']; ?>">
                        <button class="buy-btn">Buy Now</button>
                    </a>
                </div>
            <?php } ?>
        </div>
    </div>
</section>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>