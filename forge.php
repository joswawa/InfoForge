<?php
session_start();
include('server/connection.php'); // Your connection file

$receivedValue = [];

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

if (isset($_POST['build'])) {
  $PCbuild = $_POST['build']; // Assuming this contains the build info

  // For demo purposes, simulate returning some products


  // Return as JSON
  header('Content-Type: application/json');
  echo json_encode($PCbuild);
  exit;
} else {
  echo json_encode(["error" => "No data received"]);
}


?>
<?php include('layouts/header.php'); ?>

<div class="container-fluid mt-5 py-5">
  <div class="row mt-5" id="container">
    <div class="col-lg-8 col-md-12">
      <div id="3d-container" class="placeholder-for-3d w-100"></div>
      <div id="buildSummaryDiv">
        <div id="specsDiv" class="shadow-none p-3 mb-2 mt-3 bg-body-tertiary border border-dark-subtle fw-bold d-flex justify-content-between flex-column">
          <!-- contecnt here -->
          <h3 class="sage-color">Specifications</h3>
          <div id="product_specs" class="sage-color"></div>
        </div>
        <div id="summaryDiv" class="shadow-none p-3 mb-2 mt-3 bg-body-tertiary border border-dark-subtle fw-bold d-flex justify-content-between flex-column">

          <div class="mb-3">Case: <span id="case-category"></span></div><!-- Category name -->
          <div class="mb-3">Motherboard: <span id="motherboard-category"></span></div>

          <div class="mb-3">CPU: <span id="cpu-category"></span></div>

          <div class="mb-3">RAM: <span id="ram-category"></span></div>

          <div class="mb-3">Storage: <span id="storage-category"></span></div>

          <div class="mb-3">Power Supply: <span id="psu-category"></span></div>

          <div class="mb-3">Graphics Card: <span id="gpu-category"></span></div>


          <span class="d-flex justify-content-end" id="total-price">₱0</span>

        </div>
        <p class="d-flex justify-content-end">*Builds are free of charge.</p>
        <div class="d-flex justify-content-end mt-3 ml-auto">
          <button class="forgeBtn btn btn-success ml-auto" id="buildPC">Forge</button>
        </div>
      </div>

    </div>
    <div class="col-lg-4 col-md-12 border-start" id="specs">
      <h1 class="mx-3 mb-4 sage-color" id="forge-title">Forge a PC</h1>



      <!-- Filter Button -->
      <div class="d-flex justify-content-between align-items-center dropdown mb-3 mx-4">
        <div>
          <i class="fa fa-undo mt-3 undo me-2" style="font-size:24px; "></i>
          <i class="fa fa-trash-o" id="undoAll" style="font-size:24px"></i>
        </div>
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-filter"></i>
        </button>
        <ul class="dropdown-menu w-100 p-4">
          <label class="fw-bold mb-3">Performance</label>
          <div class="form-check dropdown-item mb-3">
            <input class="form-check-input" type="radio" name="performance" id="performance-basic" value="basic">
            <label class="form-check-label" for="performance-basic">Budget Computer</label>
          </div>
          <div class="form-check dropdown-item mb-3">
            <input class="form-check-input" type="radio" name="performance" id="performance-intermediate" value="intermediate">
            <label class="form-check-label" for="performance-intermediate">Office Computer</label>
          </div>
          <div class="form-check dropdown-item mb-3">
            <input class="form-check-input" type="radio" name="performance" id="performance-high" value="high">
            <label class="form-check-label" for="performance-high">High-end / Gaming Computer</label>
          </div>

          <label for="budgetInput" class="fw-bold mb-3">Price Range</label>
          <div class=" input-group input-group-sm w-50">
            <span class="input-group-text">₱</span>
            <input type="number" class="form-control dropdown-item" id="budget-min" name="budget-min" placeholder="Min Price" min="0" style="max-width: 200px;">
            <span class="input-group-text">to</span>
            <input type="number" class="form-control dropdown-item" id="budget-max" name="budget-max" placeholder="Max Price" min="0" style="max-width: 200px;">
          </div>
        </ul>
      </div>

      <!-- Components List -->
      <div id="alertMessage">
      </div>
      <div id="components-list">
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold case" id="components">Case</div>
        <div class="all-case hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component motherboard" id="components">Motherboard</div>
        <div class="all-motherboard hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component cpu" id="components">CPU</div>
        <div class="all-cpu hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component gpu" id="components">GPU</div>
        <div class="all-gpu hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component ram" id="components">RAM</div>
        <div class="all-ram hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component storage" id="components">Storage</div>
        <div class="all-storage hide-components overflow-auto mb-1" id="component-card"></div>
        <div class="shadow-none p-3 mb-2 mx-3 bg-body-tertiary border border-dark-subtle fw-bold disabled-component power-supply" id="components">Power Supply</div>
        <div class="all-power-supply hide-components overflow-auto mb-1" id="component-card"></div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL loading -->
<div class="dropdown" id="loading" style="color: black;">
  <div id="loadingMessage"></div>
</div>




<!-- footer -->
<footer id="contact" class=" py-5">
  <div class="row container mx-auto pt-5">
    <div class="footer-one col-lg-3 col-md-6 col-sm-12">
      <img src="assets/imgs/logo.png" class="footer-logo">
      <p class="pt-3">We provide the best products for the most affordable prices</p>
    </div>
    <div class="footer-one col-lg-3 col-md-6 col-sm-12">
      <h5 class="pb-2">Featured</h5>
      <ul class="text-uppercase">
        <li><a href="#">Case</a></li>
        <li><a href="#">Motherboard</a></li>
        <li><a href="#">Laptop</a></li>
        <li><a href="#">Accesories</a></li>
        <li><a href="#">CPU</a></li>
        <li><a href="#">RAM</a></li>
        <li><a href="#">GPU</a></li>
        <li><a href="#">Storage</a></li>
      </ul>
    </div>

    <div class="footer-one col-lg-3 col-md-6 col-sm-12">
      <h5 class="pb-2">Contact Us</h5>
      <div>
        <h6 class="text-uppercase">Address</h6>
        <p>Phase 4 46 street Block 54 Lot 27 Wellington Residence Brgy Tres Cruses Tanza Cavite, Philippines</p>
      </div>
      <div>
        <h6 class="text-uppercase">Phone</h6>
        <p>+468946564</p>
      </div>
      <div>
        <h6 class="text-uppercase">Email</h6>
        <p>lorger18@gmail.com</p>
      </div>
    </div>
    <div class="socials footer-one col-lg-3 col-md-6 col-sm-12">
      <h5 class="pb-2">Socials</h5>
      <div class="row">
        <div class="col-lg-6 col-md-10 col-sm-24 mb-4">
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>
  </div>
</footer>


<script src="https://kit.fontawesome.com/e79b186fdc.js" crossorigin="anonymous"></script>
<!-- New Integrity for popper js -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" 
        integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" 
        crossorigin="anonymous"></script> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
  integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
  crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>


<script type="module" src="main.js"></script>
<script type="module" src="forge.js"></script>

</body>

</html>