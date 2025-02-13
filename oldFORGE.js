// Fetch all products from the server
let selectedProduct = [];
const PCbuild = [];
let quantity = 1;

// Function to fetch products
function fetchAllProducts() {
  return fetch("server/fetch_productsFromDatabase.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((products) => {
      // console.log("Fetched Products:", products);
      return products;
    })
    .catch((error) => console.error("Error fetching products:", error));
}



function fetchAllCompatability() {
  return fetch(`server/fetch_compatible_products.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((allCompaProducts) => {
      //  console.log("Fetched Compatible:", allCompaProducts);
      return allCompaProducts;
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Function to filter products by category
function filterProductsByCategory(products, category) {
  return products.filter((product) => product.product_category === category);
}

function filterByCompatibility(selectedProductID, allCompaProducts) {
  return allCompaProducts.filter(
    (comp) => String(comp.product_id) === String(selectedProductID[0].id)
  );
}

// Function to show products or placeholders in the dropdown
function showChosenComponent(componentDiv, category) {
  if (currentOpenDropdown && currentOpenDropdown !== componentDiv) {
    currentOpenDropdown.classList.remove("show-components");
    currentOpenDropdown.classList.add("hide-components");
  }

  componentDiv.classList.toggle("show-components");

  if (componentDiv.classList.contains("show-components")) {
    componentDiv.classList.remove("hide-components");
    productsHTML = "";

    fetchAllProducts().then((products) => {
      // If a product is selected, filter for compatibility
      if (selectedProduct && selectedProduct.length > 0) {
        fetchAllCompatability()
          .then((allCompaProducts) => {
            const compatibleProds = filterByCompatibility(
              selectedProduct,
              allCompaProducts
            );
            const filteredProducts = filterProductsByCategory(
              products,
              category
            );

            let compatibleHTML = "";
            let remainingHTML = "";

            //SHOW COMPATIBLE
            if (compatibleProds.length > 0) {
              compatibleProds.forEach((compData) => {
                const compatibleProduct = products.find(
                  (product) =>
                    product.product_id === compData.compatible_product_id
                );

                if (compatibleProduct) {
                  const filteredByCategory = filterProductsByCategory(
                    [compatibleProduct],
                    category
                  );

                  if (filteredByCategory.length > 0) {
                    const productImage = compatibleProduct.product_image || "";
                    compatibleHTML += `
                        <div class="selBtn shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1" 
                        data-cat="${compatibleProduct.product_category}" 
                        data-id="${compatibleProduct.product_id}" 
                        data-name="${compatibleProduct.product_name}" 
                        data-price="${compatibleProduct.price}" 
                        data-image="${compatibleProduct.product_image}" 
                        data-modelpath="${compatibleProduct.modelPath}"
                        data-quantity= "${quantity}"> 
                        
                        <img class="case-img me-5" src="${productImage}" alt="Product Image">
  
                        <div class="component-info">
                          <p class="component-info">${
                            compatibleProduct.product_name
                          }</p>
                        </div>

                        ${
                          compatibleProduct.product_category === 6 ||
                          compatibleProduct.product_category === 7
                            ? `<div class="component-info text-end">
                                  <label for="OrderQuantity">Quantity:</label>
                                  <input type="number" class="OrderQuantity" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="4"
                                style="width: 50px; height: 23px; font-size: 16px;">
                              </div>`
                            : ""
                        }
                          <div class="component-info text-end"><p class="text-end">+${
                            compatibleProduct.price
                          }
                          </p></div>
                          <span style="background-color: #4CAF50; color: white; padding: 2px 8px; font-size: 12px; border-radius: 5px; margin-left: 10px;">Compatible</span>
                        </div>`;
                  }
                }
              });
            } else {
              compatibleHTML = `<div class="shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1"><p>No compatible products.</p></div>`;
            }

            //SHOW REMAINING PRODUCTS (not compatible)
            const remainingProducts = filteredProducts.filter(
              (product) =>
                !compatibleProds.some(
                  (compData) =>
                    compData.compatible_product_id === product.product_id
                )
            );

            remainingProducts.forEach((product) => {
              const productImage = product.product_image || "";
              remainingHTML += `
                  <div class="selBtn shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1" 
                    data-cat="${product.product_category}" 
                    data-id="${product.product_id}" 
                    data-name="${product.product_name}" 
                    data-price="${product.price}" 
                    data-image="${product.product_image}" 
                    data-modelpath="${product.modelPath}"
                    data-quantity= "${quantity}">
                    <img class="case-img me-5" src="${productImage}" alt="Product Image">
                    <div class="component-info">
                      <p class="component-info">${product.product_name}</p>
                    </div>
                    ${
                      product.product_category === 6 ||
                      product.product_category === 7
                        ? `<div class="component-info text-end">
                        <label for="OrderQuantity">Quantity:</label>
                        <input type="number" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="2" style="width: 50px; height: 23px; font-size: 16px;>
                      </div>`
                        : ""
                    }
                    <div class="component-info text-end"><p class="text-end">+${
                      product.price
                    }</p></div>
                  </div>`;
            });

            // Combine compatible and remaining products HTML
            componentDiv.innerHTML = compatibleHTML + remainingHTML;
          })
          .catch(() => {
            componentDiv.innerHTML = `<div class="shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1"><p>Failed to load compatibility data.</p></div>`;
          });
      } else {
        // SHOW ALL PRODUCTS, NO FILTER
        const filteredProducts = filterProductsByCategory(products, category);
        filteredProducts.forEach((product) => {
          const productImage = product.product_image || "";
          productsHTML += `
              <div class="selBtn shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1" 
                data-cat="${product.product_category}" 
                data-id="${product.product_id}" 
                data-name="${product.product_name}" 
                data-price="${product.price}" 
                data-image="${product.product_image}" 
                data-modelpath="${product.modelPath}"
                data-quantity= "${quantity}">
                <img class="case-img me-5" src="${productImage}" alt="Product Image">
                <div class="component-info">
                  <p class="component-info">${product.product_name}</p>
                </div>
                ${
                  product.product_category === 6 ||
                  product.product_category === 7
                    ? `<div class="component-info text-end">
                    <label for="OrderQuantity">Quantity:</label>
                    <input type="number" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="2" style="width: 50px; height: 23px; font-size: 16px;>
                  </div>`
                    : ""
                }
                <div class="component-info text-end"><p class="text-end">+${
                  product.price
                }</p></div>
              </div>`;
        });
        componentDiv.innerHTML = productsHTML;
      }
    });

    currentOpenDropdown = componentDiv;
  } else {
    componentDiv.classList.add("hide-components");
    currentOpenDropdown = null;
  }
}

function loadModel(modelPath, position, image) {
  // Pass the model path and image path to the Three.js rendering file
  window.dispatchEvent(
    new CustomEvent("load3DModel", {
      detail: {
        path: modelPath,
        position: position,
        image: image, // Pass the image as part of the event
      },
    })
  );
}

function changeQuantity(event) {
  const inputField = event.target.closest(".OrderQuantity");

  if (!inputField) return;
  console.log(inputField.value);

  quantity = inputField.value;
}

function selectProduct(event) {
  let selectedProductObj = {};

  const productElement = event.target.closest(".selBtn");

  if (!productElement) return; // Exit if it's not a valid product element

  // Get the product data from the dataset attributes
  selectedProductObj = {
    id: productElement.dataset.id,
    category: productElement.dataset.cat,
    name: productElement.dataset.name,
    quantity: quantity,
    price: productElement.dataset.price,
    image: productElement.dataset.image,
    modelPath: productElement.dataset.modelpath,
  };

  const existingProdIndex = PCbuild.findIndex(
    (product) => product.category === selectedProductObj.category
  );

  if (existingProdIndex === -1) {
    // If the product doesn't exist, add it to the PCbuild array
    PCbuild.push(selectedProductObj);
  } else {
    // If the product exists, replace the existing entry
    PCbuild[existingProdIndex] = selectedProductObj;
  }

  console.log(PCbuild);
  quantity = 1;

  const categoryMapping = {
    1: ".motherboard",
    2: ".cpu",
    3: ".power-supply",
    5: ".case",
    6: ".storage",
    7: ".ram",
  };

  const summarycategoryMapping = {
    1: "motherboard",
    2: "cpu",
    3: "psu",
    5: "case",
    6: "storage",
    7: "ram",
    4: "gpu",
  };

  // Clear the (Required!) indicator if it exists for the selected category
  const selectedCategorySelector = categoryMapping[selectedProductObj.category];
  const selectedCategoryElement = document.querySelector(
    selectedCategorySelector
  );

  if (selectedCategoryElement) {
    // Use replace() and update the innerHTML for the selected category only
    selectedCategoryElement.innerHTML =
      selectedCategoryElement.innerHTML.replace(
        /<span style="color: red;">\(Required!\)<\/span>/g,
        ""
      );
  }

  // Update the corresponding category section with the product name
  const categoryKey = summarycategoryMapping[selectedProductObj.category];
  const categoryElement = document.getElementById(`${categoryKey}-category`);

  if (categoryElement) {
    categoryElement.innerHTML = selectedProductObj.name;
  }

  const existingProductIndex = selectedProduct.findIndex(
    (product) => product.id === selectedProductObj.id
  );

  if (existingProductIndex === -1) {
    selectedProduct.push(selectedProductObj);
  } else {
    selectedProduct[existingProductIndex] = selectedProductObj;
  }

  const position = { x: 0, y: 1.05, z: 0 };

  // Check if the modelPath exists before loading the model
  if (selectedProductObj.modelPath) {
    // Pass the modelPath to the 3D rendering function
    loadModel(selectedProductObj.modelPath, position, selectedProductObj.image);
  } else {
    console.log(
      `No 3D model available for product: ${selectedProductObj.name}`
    );
  }

  let totalPrice = 0;
  PCbuild.forEach((product) => {
    totalPrice += product.price * product.quantity; // Assuming quantity is 1 for now
  });

  // Update the total price on the page
  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.innerHTML = `₱${totalPrice.toFixed(2)}`;
  }
}

// Attach event listener using delegation
document.addEventListener("click", (event) => {
  if (event.target.closest(".selBtn")) {
    selectProduct(event);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.closest(".OrderQuantity")) {
    changeQuantity(event);
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".checkoutBtn")) {
    addToOrderCart(event);
  }
});

// Button selectors for different categories
const checkOutBuild = document.querySelector(".checkoutBtn");
const buildPC = document.querySelector(".forgeBtn");
const caseBtn = document.querySelector(".case");
const cpuBtn = document.querySelector(".cpu");
const gpuBtn = document.querySelector(".gpu");
const motherboardBtn = document.querySelector(".motherboard");
const ramBtn = document.querySelector(".ram");
const storageBtn = document.querySelector(".storage");
const powerSupplyBtn = document.querySelector(".power-supply");
const monitorBtn = document.querySelector(".monitor");
const keyboardBtn = document.querySelector(".keyboard");
const mouseBtn = document.querySelector(".mouse");

// Dropdown container selectors
const showAllCase = document.querySelector(".all-case");
const showAllCpu = document.querySelector(".all-cpu");
const showAllGpu = document.querySelector(".all-gpu");
const showAllMotherboard = document.querySelector(".all-motherboard");
const showAllRam = document.querySelector(".all-ram");
const showAllStorage = document.querySelector(".all-storage");
const showAllPowerSupply = document.querySelector(".all-power-supply");
const showAllMonitor = document.querySelector(".all-monitor");
const showAllKeyboard = document.querySelector(".all-keyboard");
const showAllMouse = document.querySelector(".all-mouse");

let productsHTML = "";
let currentOpenDropdown = null;
let buildToOrder;

const categoryMap = {
  1: "Motherboard",
  2: "CPU",
  3: "PowerSupply",
  4: "Graphics Card",
  5: "Case",
  6: "Storage",
  7: "Ram",
};

// Event listener for the Forge button
buildPC.addEventListener("click", () => {
  // Helper function to check if PCbuild contains the required categories
  function findMissingCategories(PCbuild, requiredCategories) {
    const selectedCategories = PCbuild.map((product) => product.category);
    return requiredCategories.filter(
      (category) => !selectedCategories.includes(category)
    );
  }

  // Define the required categories and their corresponding HTML elements
  const requiredCategories = ["1", "2", "3", "5", "6", "7"];
  const categoryMapping = {
    1: ".motherboard",
    7: ".cpu",
    2: ".power-supply",
    4: ".case",
    6: ".storage",
    3: ".ram",
  };

  // Clear any existing (Required!) indicators before adding new ones
  Object.values(categoryMapping).forEach((selector) => {
    const categoryElement = document.querySelector(selector);
    if (categoryElement) {
      // Use replace() and update the innerHTML
      categoryElement.innerHTML = categoryElement.innerHTML.replace(
        /<span style="color: red;">\(Required!\)<\/span>/g,
        ""
      );
    }
  });

  // Find all missing categories
  const missingCategories = findMissingCategories(PCbuild, requiredCategories);

  // If any required categories are missing, add a "(Required!)" to them
  if (missingCategories.length > 0) {
    missingCategories.forEach((missingCategory) => {
      const missingCategoryElement = document.querySelector(
        categoryMapping[missingCategory]
      );
      if (missingCategoryElement) {
        // Append the (Required!) warning
        missingCategoryElement.innerHTML +=
          ' <span style="color: red;">(Required!)</span>';
        missingCategoryElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }); // Optionally scroll to the element
      }
    });
    return; // Exit if any required category is missing
  }
  // Add the checkout button
  $("#buildSummaryDiv").append(`
        <div class="d-flex justify-content-end mt-3">
    <button class="checkoutBtn btn btn-success ml-auto" id="checkoutBtn">Add to Cart</button>
  </div>
      `);

  //render PC Build here
  // RENDER FINAL BUILD HERE

  let fullBuildModelPath = "";

  // Check for specific products (darkflash dlm23 or asus tuf GT501)
  const containsDarkflash = PCbuild.some((product) =>
    product.name.includes("darkflash dlm23")
  );
  const containsAsusTuf = PCbuild.some((product) =>
    product.name.includes("asus tuf gt501")
  );

  if (containsDarkflash) {
    fullBuildModelPath = "finalbuilds/darkflash dlm23.gltf"; // Update the path as needed
    console.log(fullBuildModelPath);
  } else if (containsAsusTuf) {
    fullBuildModelPath = "finalbuilds/asus tuf gt501.gltf"; // Update the path as needed
    console.log(fullBuildModelPath);
  } else {
    fullBuildModelPath = "finalbuilds/Fortress-Carbide- FINAL.gltf"; // Default model if neither is present
  }

  // Define the position for rendering the full build model
  const fullBuildPosition = { x: 0, y: 1.05, z: 0 };
  const fullBuildImage = "images/fullBuild/fullPCImage.jpg"; // Adjust the image path as needed

  if (fullBuildModelPath) {
    // Pass the modelPath to the 3D rendering function
    loadModel(fullBuildModelPath, fullBuildPosition, fullBuildImage);
  } else {
    console.log(`No 3D Model for: Final Build`);
  }
});
function addToOrderCart(event) {
  let total = 0;

  // Iterate through the PCbuild array
  PCbuild.forEach((item) => {
    // Calculate the total price considering quantity
    total += item.price * item.quantity;
  });

  // If you want to show the total price on the page, for example:
  const totalElement = document.querySelector("#total-price");
  if (totalElement) {
    totalElement.innerText = "Total Price: ₱" + total;
  }

  // Prepare the data to send to the server
  const dataToSend = {
    items: PCbuild,
  };

  // console.log(dataToSend);
  // console.log(PCbuild);

  // Make an AJAX request to send the cart to the server (PHP)
  fetch("server/addBuildToCart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Return text if JSON parsing fails
    })
    .then((data) => {
      try {
        const jsonData = JSON.parse(data); // Parse manually
        if (jsonData.message) {
          console.log(jsonData.message);

          // If success, redirect to another page (e.g., cart or confirmation page)
          if (jsonData.message === "Build added to cart successfully.") {
            window.location.href = "account.php"; // Redirect to your desired page
          }
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Event listeners for each category button
caseBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllCase, 4); // Assuming 5 corresponds to 'Case'
});
cpuBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllCpu, 7); // Assuming 2 corresponds to 'CPU'
});
gpuBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllGpu, 3); // Assuming 3 corresponds to 'GPU'
});
motherboardBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllMotherboard, 1); // Assuming 1 corresponds to 'Motherboard'
});
ramBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllRam, 6); // Assuming 7 corresponds to 'RAM'
});
storageBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllStorage, 5); // Assuming 6 corresponds to 'Storage'
});
powerSupplyBtn.addEventListener("click", () => {
  productsHTML = "";
  showChosenComponent(showAllPowerSupply, 2); // Assuming 4 corresponds to 'Power Supply'
});
// monitorBtn.addEventListener("click", () => {
//   productsHTML = "";
//   showChosenComponent(showAllMonitor, 8); // Assuming 8 corresponds to 'Monitor'
// });
// keyboardBtn.addEventListener("click", () => {
//   productsHTML = "";
//   showChosenComponent(showAllKeyboard, 8); // Assuming 9 corresponds to 'Keyboard'
// });
// mouseBtn.addEventListener("click", () => {
//   productsHTML = "";
//   showChosenComponent(showAllMouse, 8); // Assuming 10 corresponds to 'Mouse'
// });







// Label eme specs

$specs = explode(",", $product['specs']);

                                                      
                                                        switch ($product['categories_name']) {
                                                            case 'Motherboard':
                                                                $labels = array_merge(['Socket Type', 'Chipset', 'Form Factor', 'Max RAM Capacity', 'RAM Type', 'RAM Slots', 'PCIe Slots', 'Storage Interfaces']);
                                                                break;
                                                            case 'CPU':
                                                                $labels = array_merge(['Socket Compatibility', 'Core Count', 'Base Clock Speed', 'Boost Clock Speed', 'TDP', 'Integrated Graphics']);
                                                                break;
                                                            case 'Power Supply':
                                                                $labels = array_merge(['Wattage', 'Efficiency Rating', 'Form Factor', 'Modular', 'PCIe Power Connectors']);
                                                                break;
                                                            case 'Graphics Card':
                                                                $labels = array_merge(['PCIe Version', 'VRAM', 'TDP', 'Power Connectors', 'Length']);
                                                                break;
                                                            case 'PC Case':
                                                                $labels = array_merge(['Form Factor', 'Max GPU Length', 'Max CPU Cooler Height', 'Max PSU Length', 'Drive Bays']);
                                                                break;
                                                            case 'Storage':
                                                                $labels = array_merge(['Storage Type', 'Form Factor', 'Interface', 'Capacity', 'Read/Write Speed']);
                                                                break;
                                                            case 'RAM':
                                                                $labels = array_merge(['RAM Type', 'Capacity', 'Frequency', 'CAS Latency', 'Voltage']);
                                                                break;
                                                            case 'Peripherals':
                                                                $labels = array_merge(['Connection Type', 'Features']);
                                                                break;
                                                            default:
                                                                // Use default labels for undefined categories
                                                                $labels = $defaultLabels;
                                                                break;
                                                        }
                                                        foreach ($labels as $index => $label) {
                                                            // Check if the spec exists at this index before displaying
                                                            if (isset($specs[$index])) {
                                                                echo "<p><strong>$label:</strong> " . htmlspecialchars($specs[$index]) . "</p>";
                                                            }
                                                        }




                                                        function selectProduct(event) {
                                                          let selectedProductObj = {};
                                                      
                                                          const productElement = event.target.closest(".selBtn");
                                                          if (!productElement) return;
                                                      
                                                          // Get product details from the dataset
                                                          selectedProductObj = {
                                                              id: productElement.dataset.id,
                                                              category: productElement.dataset.cat,
                                                              name: productElement.dataset.name,
                                                              quantity: quantity,
                                                              specs: productElement.dataset.specs.split(','), // Split specs into an array
                                                              price: productElement.dataset.price,
                                                              image: productElement.dataset.image,
                                                              modelPath: productElement.dataset.modelpath,
                                                          };
                                                      
                                                          // Check if a product of this category is already in the build
                                                          const existingProdIndex = PCbuild.findIndex(
                                                              (product) => product.category === selectedProductObj.category
                                                          );
                                                      
                                                          if (existingProdIndex === -1) {
                                                              PCbuild.push(selectedProductObj);
                                                          } else {
                                                              PCbuild[existingProdIndex] = selectedProductObj;
                                                          }
                                                      
                                                          console.log(PCbuild);
                                                          quantity = 1;
                                                      
                                                          // Compatibility Check Logic
                                                          PCbuild.forEach((product) => {
                                                              if (product.category === '1') { // If a motherboard is selected
                                                                  // Check compatibility with CPU
                                                                  const cpu = PCbuild.find((p) => p.category === '7'); // CPU category
                                                                  if (cpu) {
                                                                      const isSocketCompatible = selectedProductObj.specs.includes(cpu.specs[0]); // Example: Check first spec is socket type
                                                                      if (!isSocketCompatible) {
                                                                          console.log("Incompatible CPU and Motherboard: Different socket types.");
                                                                      }
                                                                  }
                                                      
                                                                  // Check compatibility with RAM
                                                                  const ram = PCbuild.find((p) => p.category === '6'); // RAM category
                                                                  if (ram) {
                                                                      const isRamCompatible = selectedProductObj.specs.includes(ram.specs[1]); // Example: Check second spec is RAM type
                                                                      if (!isRamCompatible) {
                                                                          console.log("Incompatible RAM and Motherboard: Different RAM types.");
                                                                      }
                                                                  }
                                                              }
                                                      
                                                              if (product.category === '2') { // If a PSU is selected
                                                                  const gpu = PCbuild.find((p) => p.category === '3'); // GPU category
                                                                  if (gpu) {
                                                                      const requiredWattage = parseInt(gpu.specs[3]); // Example: GPU's power requirement
                                                                      const psuWattage = parseInt(selectedProductObj.specs[0]); // PSU wattage spec
                                                                      if (psuWattage < requiredWattage) {
                                                                          console.log("Incompatible PSU and GPU: Insufficient power.");
                                                                      }
                                                                  }
                                                              }
                                                      
                                                              // Add more compatibility checks here as needed
                                                          });
                                                      
                                                          // Update UI and product selections (this part remains unchanged)
                                                          const categoryMapping = { ... };
                                                          const summarycategoryMapping = { ... };
                                                      
                                                          const selectedCategorySelector = categoryMapping[selectedProductObj.category];
                                                          const selectedCategoryElement = document.querySelector(selectedCategorySelector);
                                                          if (selectedCategoryElement) {
                                                              selectedCategoryElement.innerHTML = selectedCategoryElement.innerHTML.replace(/<span style="color: red;">\(Required!\)<\/span>/g, "");
                                                          }
                                                      
                                                          const categoryKey = summarycategoryMapping[selectedProductObj.category];
                                                          const categoryElement = document.getElementById(`${categoryKey}-category`);
                                                          if (categoryElement) {
                                                              categoryElement.innerHTML = selectedProductObj.name;
                                                          }
                                                      
                                                          const existingProductIndex = selectedProduct.findIndex(
                                                              (product) => product.id === selectedProductObj.id
                                                          );
                                                      
                                                          if (existingProductIndex === -1) {
                                                              selectedProduct.push(selectedProductObj);
                                                          } else {
                                                              selectedProduct[existingProductIndex] = selectedProductObj;
                                                          }
                                                      
                                                          const position = { x: 0, y: 1.05, z: 0 };
                                                          if (selectedProductObj.modelPath) {
                                                              loadModel(selectedProductObj.modelPath, position, selectedProductObj.image);
                                                          }
                                                      
                                                          let totalPrice = 0;
                                                          PCbuild.forEach((product) => {
                                                              totalPrice += product.price * product.quantity;
                                                          });
                                                      
                                                          const totalPriceElement = document.getElementById("total-price");
                                                          if (totalPriceElement) {
                                                              totalPriceElement.innerHTML = `₱${totalPrice.toFixed(2)}`;
                                                          }
                                                      }
                                                      




                                                      function selectProduct(event) {
                                                        let selectedProductObj = {};
                                                      
                                                        const productElement = event.target.closest(".selBtn");
                                                      
                                                        if (!productElement) return; // Exit if it's not a valid product element
                                                      
                                                        // Get the product data from the dataset attributes
                                                        selectedProductObj = {
                                                          id: productElement.dataset.id,
                                                          category: productElement.dataset.cat,
                                                          name: productElement.dataset.name,
                                                          quantity: quantity,
                                                          specs: productElement.dataset.specs,
                                                          price: productElement.dataset.price,
                                                          image: productElement.dataset.image,
                                                          modelPath: productElement.dataset.modelpath,
                                                        };
                                                        const existingProdIndex = PCbuild.findIndex(
                                                          (product) => product.category === selectedProductObj.category
                                                        );
                                                      
                                                        if (existingProdIndex === -1) {
                                                          // If the product doesn't exist, add it to the PCbuild array
                                                          PCbuild.push(selectedProductObj);
                                                        } else {
                                                          // If the product exists, replace the existing entry
                                                          PCbuild[existingProdIndex] = selectedProductObj;
                                                        }
                                                      
                                                        console.log(PCbuild);
                                                        quantity = 1;
                                                      
                                                        //Maps
                                                        const category_spec_mapping = {
                                                          1: [
                                                            "Socket Type",
                                                            "Chipset",
                                                            "Form Factor",
                                                            "Max RAM Capacity",
                                                            "RAM Type",
                                                            "RAM Slots",
                                                            "PCIe Slots",
                                                            "Storage Interfaces",
                                                          ],
                                                          7: [
                                                            "Socket Compatibility",
                                                            "Core Count",
                                                            "Base Clock Speed",
                                                            "Boost Clock Speed",
                                                            "TDP",
                                                            "Integrated Graphics",
                                                          ],
                                                          2: [
                                                            "Wattage",
                                                            "Efficiency Rating",
                                                            "Form Factor",
                                                            "Modular",
                                                            "PCIe Power Connectors",
                                                          ],
                                                          3: ["PCIe Version", "VRAM", "TDP", "Power Connectors", "Length"],
                                                          4: [
                                                            "Form Factor",
                                                            "Max GPU Length",
                                                            "Max CPU Cooler Height",
                                                            "Max PSU Length",
                                                            "Drive Bays",
                                                          ],
                                                          5: [
                                                            "Storage Type",
                                                            "Form Factor",
                                                            "Interface",
                                                            "Capacity",
                                                            "Read/Write Speed",
                                                          ],
                                                          6: ["RAM Type", "Capacity", "Frequency", "CAS Latency", "Voltage"],
                                                        };
                                                      
                                                        //Filterting emez
                                                        if (selectedProductObj) {
                                                          // Check if there are previously selected products
                                                          if (selectedProduct.length > 0) {
                                                            // Loop through each previously selected product in selectedProduct array
                                                            selectedProduct.forEach((prevProduct) => {
                                                              // Split the specs of both the previous and the selected product by comma
                                                              const prevProductSpecs = prevProduct.specs.split(",");
                                                              const selectedProductSpecs = selectedProductObj.specs.split(",");
                                                      
                                                              // Check for compatibility: Look for any common word between the specs
                                                              const isCompatible = prevProductSpecs.some((prevSpec) =>
                                                                selectedProductSpecs.some((selectedSpec) =>
                                                                  selectedSpec
                                                                    .trim()
                                                                    .toLowerCase()
                                                                    .includes(prevSpec.trim().toLowerCase())
                                                                )
                                                              );
                                                      
                                                              // current
                                                              console.log(selectedProductSpecs);
                                                              console.log(prevProductSpecs);
                                                      
                                                              if (isCompatible) {
                                                                console.log(
                                                                  `The selected product (${selectedProductObj.name}) is compatible with the previously selected product (${prevProduct.name}) based on specs.`
                                                                );
                                                              } else {
                                                                console.log(
                                                                  `The selected product (${selectedProductObj.name}) is not compatible with the previously selected product (${prevProduct.name}) based on specs.`
                                                                );
                                                              }
                                                            });
                                                          } else {
                                                            console.log("No previously selected products to check.");
                                                          }
                                                        }
                                                      
                                                        const categoryMapping = {
                                                          1: ".motherboard",
                                                          7: ".cpu",
                                                          2: ".power-supply",
                                                          4: ".case",
                                                          5: ".storage",
                                                          6: ".ram",
                                                        };
                                                      
                                                        const summarycategoryMapping = {
                                                          1: "motherboard",
                                                          7: "cpu",
                                                          2: "psu",
                                                          4: "case",
                                                          5: "storage",
                                                          6: "ram",
                                                          3: "gpu",
                                                        };
                                                      
                                                        // Clear the (Required!) indicator if it exists for the selected category
                                                        const selectedCategorySelector = categoryMapping[selectedProductObj.category];
                                                        const selectedCategoryElement = document.querySelector(
                                                          selectedCategorySelector
                                                        );
                                                      
                                                        if (selectedCategoryElement) {
                                                          // Use replace() and update the innerHTML for the selected category only
                                                          selectedCategoryElement.innerHTML =
                                                            selectedCategoryElement.innerHTML.replace(
                                                              /<span style="color: red;">\(Required!\)<\/span>/g,
                                                              ""
                                                            );
                                                        }
                                                      
                                                        // Update the corresponding category section with the product name
                                                        const categoryKey = summarycategoryMapping[selectedProductObj.category];
                                                        const categoryElement = document.getElementById(`${categoryKey}-category`);
                                                      
                                                        if (categoryElement) {
                                                          categoryElement.innerHTML = selectedProductObj.name;
                                                        }
                                                      
                                                        const existingProductIndex = selectedProduct.findIndex(
                                                          (product) => product.id === selectedProductObj.id
                                                        );
                                                      
                                                        if (existingProductIndex === -1) {
                                                          selectedProduct.push(selectedProductObj);
                                                        } else {
                                                          selectedProduct[existingProductIndex] = selectedProductObj;
                                                        }
                                                      
                                                        const position = { x: 0, y: 1.05, z: 0 };
                                                      
                                                        // Check if the modelPath exists before loading the model
                                                        if (selectedProductObj.modelPath) {
                                                          // Pass the modelPath to the 3D rendering function
                                                          loadModel(selectedProductObj.modelPath, position, selectedProductObj.image);
                                                        } else {
                                                          console.log(
                                                            `No 3D model available for product: ${selectedProductObj.name}`
                                                          );
                                                        }
                                                      
                                                        let totalPrice = 0;
                                                        PCbuild.forEach((product) => {
                                                          totalPrice += product.price * product.quantity; // Assuming quantity is 1 for now
                                                        });
                                                      
                                                        // Update the total price on the page
                                                        const totalPriceElement = document.getElementById("total-price");
                                                        if (totalPriceElement) {
                                                          totalPriceElement.innerHTML = `₱${totalPrice.toFixed(2)}`;
                                                        }
                                                      }
                                                      
                                                      // Attach event listener using delegation
                                                      document.addEventListener("click", (event) => {
                                                        if (event.target.closest(".selBtn")) {
                                                          selectProduct(event);
                                                        }
                                                      });