<!-- Header -->
<?php include('layouts/header.php'); ?>

<section id="home">
    <div class="container px-0">
        <img src="./assets/imgs/forge-banner-2.png" class="forge-banner img-fluid " alt="">
    </div>
</section>

<section class="categories-section my-5 ">
    <div class="container">
        <h2 class="fw-bold">Browse by categories</h2>
        <hr class="mb-5">
        <div class="row gap-0 flex-nowrap overflow-x-auto categories-grid">
            <div class="col-md-3 w-auto px-1">
                <div class="card categories-card h-100" onclick="window.location.href='products.php?category=8'">
                    <img src="./assets/imgs/monitor-img-2.png" class="monitor-img card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Peripherals</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=6'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/ram-img.png" class="monitor-img card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Rams</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=3'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/graphics-card-img-2.png" class="monitor-img card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Graphics</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=4'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/pc-case-img.png" class="monitor-img card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Cases</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=2'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/psu-img.png" class="monitor-img card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Power Supplies</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=1'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/motherboard-img.png" class="monitor-img card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Motherboards</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=7'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/cpu-img.png" class="monitor-img card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">CPUs</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-3 w-auto px-1" onclick="window.location.href='products.php?category=5'">
                <div class="card categories-card h-100">
                    <img src="./assets/imgs/storage-img.png" class="monitor-img card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title p-categories mt-3">Storages</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- NEW Section -->
<section>
    <div class="container">
        <div class="row row-gap-3">
            <div class="col-md-12 col-lg-6">
                <div class="card ad-card">
                    <div class="row">
                        <div class="col-6 ">
                            <div class="d-flex flex-column justify-content-center align-items-center h-100">
                                <h3 class="p-categories text-center mb-4">Check all products!</h3>
                                <button onclick="window.location.href='products.php?category=all'">All Products</button>
                            </div>
                        </div>
                        <div class="col-6 d-flex justify-content-end">
                            <img src="./assets/imgs/key-img.png" class="w-50 img-fluid" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-lg-6">
                <div class="card ad-card">
                    <div class="row">
                        <div class="col-6 ">
                            <div class="d-flex flex-column justify-content-center align-items-center h-100">
                                <h3 class="p-categories text-center mb-4">Forge your own PC now!</h3>
                                <button onclick="window.location.href='forge.php'">Forge now</button>
                            </div>
                        </div>
                        <div class="col-6 d-flex justify-content-end">
                            <img src="./assets/imgs/anvil-img.png" class="w-50 img-fluid" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FEATURED Products Section -->

<section class="categories-section my-5 ">
    <div class="container">
        <h2 class="fw-bold">Featured</h2>
        <hr class="mb-5">
        <div class="row d-flex justify-content-center gap-3" id="products-grid">
            <?php include('server/get_featured_products.php') ?>
            <?php while ($row = $featured_products->fetch_assoc()) { ?>
                <div class="product text-center col-lg-3 col-md-4 col-sm-12">
                    <?php if (!empty($row['product_img1'])): ?>
                        <img src="data:image/jpeg;base64,<?= base64_encode($row['product_img1']) ?>" alt="Product Image 1" width="80%" height="50%" />
                    <?php else: ?>
                        <img src="images/avatar-2.jpg" alt="Default Image" width="100" height="100" />
                    <?php endif; ?>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h5 class="p-name"><?php echo $row['product_name']; ?></h>
                        <h4 class="p-price">₱<?php echo number_format($row['price'], 2); ?></h4>
                        <a href="<?php echo "product-description.php?product_id=" . $row['product_id']; ?>"><button class="buy-btn">Buy Now</button></a>
                </div>
            <?php } ?>
        </div>
    </div>
</section>


<!-- Keyboards Section -->
<!-- <section id="featured" class="my-5">
        <div class="container text-center mt-5 py-5">
            <h3>Mouse and Keyboards</h3>
            <hr>
            <p>Here you can check our mouse and keyboards</p>
        </div>
        <div class="row mx-auto container-fluid">
            <?php include('server/get_accesories_products.php') ?>
            <?php while ($row = $accesories_products->fetch_assoc()) { ?>
            <div class="product text-center col-lg-3 col-md-4 col-sm-12">
                <img src="assets/imgs/<?php echo $row['product_image']; ?>" alt="Product Image" class="img-fluid mb-3"/>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h5 class="p-name"><?php echo $row['product_name']; ?></h>
                <h4 class="p-price">₱<?php echo number_format($row['product_price'], 2); ?></h4>
                <a href="<?php echo "product-description.php?product_id=" . $row['product_id']; ?>"><button class="buy-btn">Buy Now</button></a>
            </div>
            <?php } ?>
        </div>
    </section>

    
    <section id="featured" class="my-5">
        <div class="container text-center mt-5 py-5">
            <h3>RAMs</h3>
            <hr>
            <p>Here you can check our RAMs</p>
        </div>
        <div class="row mx-auto container-fluid">
            <?php include('server/get_ram_products.php') ?>
            <?php while ($row = $ram_products->fetch_assoc()) { ?>
            <div class="product text-center col-lg-3 col-md-4 col-sm-12">
            <img src="assets/imgs/<?php echo $row['product_image']; ?>" alt="Product Image" style="width: 80%;" class="img-fluid mb-3"/>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h5 class="p-name"><?php echo $row['product_name']; ?></h>
                <h4 class="p-price">₱<?php echo number_format($row['product_price'], 2); ?></h4>
                <a href="<?php echo "product-description.php?product_id=" . $row['product_id']; ?>"><button class="buy-btn">Buy Now</button></a>
            </div>
            <?php } ?>
        </div>
    </section> -->

<!-- BRANDS Section -->
<section id="brand" class="container">
    <div class="row">
        <img src="assets/imgs/brand1.jpg" alt="Brand 1 Logo" class="img-fluid col-3 " />
        <img src="assets/imgs/brand2.jpg" alt="Brand 2 Logo" class="img-fluid col-3 " />
        <img src="assets/imgs/brand3.jpg" alt="Brand 3 Logo" class="img-fluid col-3 " />
        <img src="assets/imgs/brand4.jpg" alt="Brand 4 Logo" class="img-fluid col-3 " />
    </div>
</section>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>