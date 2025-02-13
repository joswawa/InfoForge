<?php include('layouts/header.php'); ?>

<section>
    <div class="container py-5 mt-5 " id="h1-div">
        <h1 class="fw-bold mt-5" id="category-h1">Products</h1>
        <hr>
    </div>
</section>

<section>
    <div class="container mt-1 overflow-auto d-flex col-12 w-100 px-0" id="category-btn-container">
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('all')">All Products</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('8')">Peripherals</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('4  ')">PC Case</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('7')">CPU</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('3')">GPU</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('1')">Motherboard</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('6')">RAM</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('5')">Storage</button>
        <button class="btn rounded-pill btn-outline-dark border-0 mx-2" onclick="filterProducts('2')">Power Supply</button>
    </div>
</section>

<!-- Shop -->
<section id="shop" class="my-3 py-3">
    <div class="container">
        <div class="row d-flex justify-content-center gap-3" id="">
            <?php
            include('server/all_products.php'); // Include the logic for fetching products
            ?>
        </div>
    </div>
</section>



<script>
    // Function to filter products by category
    function filterProducts(category) {
        // Change the URL to include the selected category
        window.location.href = `products.php?category=${category}`;
    }
</script>

<!-- Footer -->
<?php include('layouts/footer.php'); ?>