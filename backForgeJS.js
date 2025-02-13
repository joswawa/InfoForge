// Fetch all products from the server
const compatible_products = [];
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

// Function to filter products by category
function filterProductsByCategory(products, category) {
  return products.filter((product) => product.product_category === category);
}

//store compatible products
function compatibleProducts(category) {
  return fetchAllProducts()
    .then((products) => {
      const compatible = [];
      const filteredProducts = filterProductsByCategory(products, category);
      filteredProducts.forEach((product) => {
        compatible.push(product);
        compatible_products.push(product);
      });
      return compatible_products; // Returning the array here, but inside the promise
    })
    .catch((error) => {
      console.log("Error: cannot retrieve compatible products.");
      return []; // Return an empty array or handle the error as needed
    });
}
function checkSpecCompatability() {
  fetchAllProducts().then((products) => {
    PCbuild.forEach((product) => {
      // PcBuild array
      const MOBO = PCbuild.find((p) => p.category === "1");
      const PSU = PCbuild.find((p) => p.category === "2");
      const GPU = PCbuild.find((p) => p.category === "3");
      const PCcase = PCbuild.find((p) => p.category === "4");
      const Storage = PCbuild.find((p) => p.category === "5");
      const RAM = PCbuild.find((p) => p.category === "6");
      const CPU = PCbuild.find((p) => p.category === "7");

      // cons component category
      const mobo = filterProductsByCategory(products, 1);
      const psu = filterProductsByCategory(products, 2);
      const gpu = filterProductsByCategory(products, 3);
      const PcCase = filterProductsByCategory(products, 4);
      const storage = filterProductsByCategory(products, 5);
      const ram = filterProductsByCategory(products, 6);
      const cpu = filterProductsByCategory(products, 7);

      //form factor support
      const formFactorCompatibility = {
        ATX: ["ATX", "Micro-ATX", "Mini-ITX"], // ATX case supports ATX, Micro-ATX, Mini-ITX
        "Micro-ATX": ["Micro-ATX", "Mini-ITX"], // Micro-ATX case supports Micro-ATX, Mini-ITX
        "Mini-ITX": ["Mini-ITX"], // Mini-ITX case only supports Mini-ITX
      };

      if (MOBO) {
        // If a motherboard is selected

        if (cpu) {
          cpu.forEach((cpus) => {
            const cpuSpecs = cpus.specs.split(",");
            const cpuSocket = cpuSpecs[1].trim().replace(/\s+/g, "");
            const moboSocket = MOBO.specs[1].trim().replace(/\s+/g, "");
            if (moboSocket === cpuSocket) {
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(cpus)
                )
              ) {
                compatible_products.push(cpus);
              }
            } else {
              console.log(
                "Incompatible CPU and Motherboard: Different socket types."
              );
            }
          });
        } else {
          console.log("ERROR");
        }

        //Check compatibility with RAM

        if (ram) {
          ram.forEach((rams) => {
            const ramSpecs = rams.specs.split(",");
            const ramTYPE = ramSpecs[0].trim().replace(/\s+/g, "");
            const moboType = MOBO.specs[5].trim().replace(/\s+/g, "");
            if (moboType === ramTYPE) {
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(rams)
                )
              ) {
                compatible_products.push(rams);
              }
            } else {
              console.log(
                "Incompatible RAM and Motherboard: Different socket types."
              );
            }
          });
        } else {
          console.log("ERROR");
        }

        //mobo to gpu
        if (gpu) {
          gpu.forEach((gpus) => {
            const gpuSpecs = gpus.specs.split(",");
            const gpuCon = gpuSpecs[0].trim().replace(/\s+/g, "");
            const moboCon = MOBO.specs[7].trim().replace(/\s+/g, "");

            console.log("GPU", gpuCon, "MOBO", moboCon);

            if (moboCon !== gpuCon) {
              console.log(
                "Incompatible GPU and Motherboard: Different socket types."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(gpus)
                )
              ) {
                compatible_products.push(gpus);
              }
            }
          });
        }

        //mobo to psu
        if (psu) {
          psu.forEach((psus) => {
            const psuSpecs = psus.specs.split(",");
            const psuCon = psuSpecs[5].trim().replace(/\s+/g, "");
            const moboType = MOBO.specs[10].trim().replace(/\s+/g, "");

            if (moboType !== psuCon) {
              console.log("Incompatible PSU and Motherboard: Different types.");
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(psus)
                )
              ) {
                compatible_products.push(psus);
              }
            }
          });
        }

        //mobo to storage
        if (storage) {
          storage.forEach((storages) => {
            const storageSpecs = storages.specs.split(",");
            const storageType = storageSpecs[2].trim().replace(/\s+/g, "");
            const moboType = MOBO.specs[8].trim().replace(/\s+/g, "");

            if (moboType !== storageType) {
              console.log(
                "Incompatible Storage and Motherboard: Different types."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(storages)
                )
              ) {
                compatible_products.push(storages);
              }
            }
          });
        }
        // mobo to case
        if (PcCase) {
          PcCase.forEach((pcCase) => {
            const pcCaseSpecs = pcCase.specs.split(",");
            const PcCaseType = pcCaseSpecs[0].trim().replace(/\s+/g, "");
            const moboType = MOBO.specs[3].trim().replace(/\s+/g, "");
            // console.log("mobo TO case: ", PcCaseType, moboType);

            if (!formFactorCompatibility[PcCaseType].includes(moboType)) {
              console.log(
                "Incompatible PC Case and Motherboard: Different form types."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(pcCase)
                )
              ) {
                compatible_products.push(pcCase);
              }
            }
          });
        }
      }
      //end of mobo checking

      //PSU on pcBUild
      if (PSU) {
        //PSU to GPU
        if (gpu) {
          gpu.forEach((gpus) => {
            const gpuSpecs = gpus.specs.split(",");
            const ggpuWattage = parseInt(
              gpuSpecs[2].trim().replace(/\s+/g, "")
            );
            const psuWattage = parseInt(
              PSU.specs[1].trim().replace(/\s+/g, "")
            );

            if (ggpuWattage > psuWattage) {
              console.log("Incompatible PSU and GPU: Insufficient power.");
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(gpus)
                )
              ) {
                compatible_products.push(gpus);
              }
            }
          });
        }

        // PSU to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const mobosSpecs = mobos.specs.split(",");
            const psuCon = PSU.specs[5].trim().replace(/\s+/g, "");
            const moboCon = mobosSpecs[10].trim().replace(/\s+/g, "");
            console.log(moboCon);
            if (moboCon != psuCon) {
              console.log(
                "Incompatible PSU and Motherboard: Different power connectors."
              );
            } else {
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
            }
          });
        }
      }

      //GPU to PcBuild
      if (GPU) {
        // If a GPU is selected

        // GPU to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const moboSpecs = mobos.specs.split(",");
            const gpuCon = GPU.specs[0].trim().replace(/\s+/g, "");
            const moboCon = moboSpecs[7].trim().replace(/\s+/g, "");

            if (moboCon !== gpuCon) {
              console.log(
                "Incompatible GPU and Motherboard: Different socket types.!!"
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
            }
          });
        }

        // GPU to PSU

        if (psu) {
          psu.forEach((psus) => {
            const psuSpecs = psus.specs.split(",");
            const gpuWattage = parseInt(GPU.specs[2]);
            const psuWattage = parseInt(psuSpecs[1]);
            if (psuWattage < gpuWattage) {
              console.log("Incompatible PSU and GPU: Insufficient power.");
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(psus)
                )
              ) {
                compatible_products.push(psus);
              }
            }
          });
        }

        // GPU to Case
        if (PcCase) {
          PcCase.forEach((cases) => {
            const caseSpecs = cases.specs.split(",");
            const gpuLength = parseInt(GPU.specs[4]);
            const caseGpuLength = parseInt(caseSpecs[1]);
            if (gpuLength > caseGpuLength) {
              console.log("Incompatible GPU and Case: GPU is too long.");
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(cases)
                )
              ) {
                compatible_products.push(cases);
              }
            }
          });
        }
      }

      if (PCcase) {
        // If a Case is selected

        // Case to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const moboSpecs = mobos.specs.split(",");
            const caseType = PCcase.specs[0].trim().replace(/\s+/g, "");
            const moboType = moboSpecs[3].trim().replace(/\s+/g, "");
            if (!formFactorCompatibility[caseType].includes(moboType)) {
              console.log(
                "Incompatible Case and Motherboard: Different form factors."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
            }
          });
        }

        // Case to PSU
        if (psu) {
          psu.forEach((psus) => {
            const psuSpecs = psus.specs.split(",");
            const casePSUSize = PCcase.specs[0].trim().replace(/\s+/g, "");
            const psuSize = psuSpecs[3].trim().replace(/\s+/g, "");
            if (!formFactorCompatibility[casePSUSize].includes(psuSize)) {
              console.log("Incompatible Case and PSU: PSU size mismatch.");
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(psus)
                )
              ) {
                compatible_products.push(psus);
              }
            }
          });
        }

        // Case to GPU
        if (gpu) {
          gpu.forEach((gpus) => {
            const gpuSpecs = gpus.specs.split(",");
            const caseGpuLength = parseInt(PCcase.specs[1]);
            const gpuLength = parseInt(gpuSpecs[4]);
            if (gpuLength > caseGpuLength) {
              console.log(
                "Incompatible Case and GPU: GPU too long for the case."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(gpus)
                )
              ) {
                compatible_products.push(gpus);
              }
            }
          });
        }
      }

      if (Storage) {
        // If Storage is selected

        // Storage to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const moboSpecs = mobos.specs.split(",");
            const storageInterface = Storage.specs[2]
              .trim()
              .replace(/\s+/g, "");
            const moboStorageInterface = moboSpecs[8]
              .trim()
              .replace(/\s+/g, "");
            if (storageInterface != moboStorageInterface) {
              console.log(
                "Incompatible Storage and Motherboard: Different storage interfaces."
              );
            } else {
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
            }
          });
        }
      }

      if (RAM) {
        // If RAM is selected
        // RAM to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const moboSpecs = mobos.specs.split(",");
            const ramType = RAM.specs[0].trim().replace(/\s+/g, "");
            const moboRamType = moboSpecs[5].trim().replace(/\s+/g, "");
            if (ramType != moboRamType) {
              console.log(
                "Incompatible RAM and Motherboard: Different RAM types."
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
              console.log("RAM", ramType, " MOBO", moboRamType);
            }
          });
        }
      }

      if (CPU) {
        // If RAM is selected
        // RAM to Motherboard
        if (mobo) {
          mobo.forEach((mobos) => {
            const moboSpecs = mobos.specs.split(",");
            const cpuType = CPU.specs[1].trim().replace(/\s+/g, "");
            const moboType = moboSpecs[1].trim().replace(/\s+/g, "");
            // console.log("RAM", cpuType, " MOBO", moboType);
            if (cpuType != moboType) {
              console.log(
                "Incompatible CPU and Motherboard: Different RAM types.!"
              );
            } else {
              // DO something here if compatible
              if (
                !compatible_products.some(
                  (existingProduct) =>
                    JSON.stringify(existingProduct) === JSON.stringify(mobos)
                )
              ) {
                compatible_products.push(mobos);
              }
            }
          });
        }
      }

      // Add more compatibility checks here as needed
    });
  });

  return compatible_products;
}

// Function to show products or placeholders in the dropdown
let productCache = null; // Cache for products
let debouncedFetch = null; // To hold the debounce timeout

function showChosenComponent(componentDiv, category) {
  if (currentOpenDropdown && currentOpenDropdown !== componentDiv) {
    currentOpenDropdown.classList.remove("show-components");
    currentOpenDropdown.classList.add("hide-components");
  }

  componentDiv.classList.toggle("show-components");

  if (componentDiv.classList.contains("show-components")) {
    componentDiv.classList.remove("hide-components");
    let productsHTML = "";

    // Check if products are already cached
    if (productCache) {
      // If products are cached, use them directly
      renderProducts(componentDiv, category, productCache);
    } else {
      // Otherwise, fetch and cache them
      if (debouncedFetch) {
        clearTimeout(debouncedFetch);
      }

      debouncedFetch = setTimeout(() => {
        fetchAllProducts()
          .then((products) => {
            // Cache the fetched products
            productCache = products;

            // Render products once fetched
            renderProducts(componentDiv, category, products);
          })
          .catch(() => {
            componentDiv.innerHTML = `<div class="shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1"><p>Failed to load products.</p></div>`;
          });
      }, 300); // Adjust debounce time as needed
    }

    currentOpenDropdown = componentDiv;
  } else {
    componentDiv.classList.add("hide-components");
    currentOpenDropdown = null;
  }
}

function renderProducts(componentDiv, category, products) {
  let productsHTML = "";

  // Filter products by category
  const filteredProducts = filterProductsByCategory(products, category);
  const comp_products = checkSpecCompatability();
  console.log("comp_products: ", comp_products);
  const filtered_comp_products = filterProductsByCategory(
    comp_products,
    category
  );

  // Use compatible products if available, otherwise fallback to regular products
  const productsToDisplay =
    filtered_comp_products.length > 0
      ? filtered_comp_products
      : filteredProducts;

  // Build the product HTML
  productsToDisplay.forEach((product) => {
    const productImage = product.product_image || "";
    const isCompatible = filtered_comp_products.length > 0;

    productsHTML += `
      <div class="selBtn shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1" 
        data-cat="${product.product_category}" 
        data-id="${product.product_id}" 
        data-name="${product.product_name}" 
        data-price="${product.price}" 
        data-specs="${product.specs}" 
        data-image="${product.product_image}" 
        data-modelpath="${product.modelPath}" 
        data-quantity="${quantity}">
        <img class="case-img me-5" src="${productImage}" alt="Product Image">
        <div class="component-info">
          <p class="component-info">${product.product_name}</p>
        </div>
        ${
          product.product_category === 5 || product.product_category === 6
            ? `<div class="component-info text-end">
              <label for="OrderQuantity">Quantity:</label>
              <input type="number" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="2" style="width: 50px; height: 23px; font-size: 16px;">
            </div>`
            : ""
        }
        <div class="component-info text-end"><p class="text-end">+$${
          product.price
        }</p></div>
        ${
          isCompatible
            ? `<span style="background-color: #4CAF50; color: white; padding: 2px 8px; font-size: 12px; border-radius: 5px; margin-left: 10px;">Compatible</span>`
            : ""
        }
      </div>`;
  });

  componentDiv.innerHTML = productsHTML;
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
  //console.log(inputField.value);

  quantity = inputField.value;
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
    specs: productElement.dataset.specs.split(","), // Split specs into an array
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
  const requiredCategories = ["1", "2", "4", "5", "6", "7"];
  const categoryMapping = {
    1: ".motherboard",
    7: ".cpu",
    2: ".power-supply",
    4: ".case",
    5: ".storage",
    6: ".ram",
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
    //console.log(fullBuildModelPath);
  } else if (containsAsusTuf) {
    fullBuildModelPath = "finalbuilds/asus tuf gt501.gltf"; // Update the path as needed
    //console.log(fullBuildModelPath);
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
          //console.log(jsonData.message);

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
