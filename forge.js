// Fetch all products from the server
const compatible_products = [];
let selectedProduct = [];
const PCbuild = [];
let quantity = 1;
const checkedCompatability = [];

// Function to fetch products
async function fetchAllProducts() {
  return fetch("server/fetch_productsFromDatabase.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((products) => {
      return products;
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Function to filter products by category
function filterProductsByCategory(products, category) {
  return products.filter((product) => product.product_category === category);
}

function checkSpecCompatability() {
  fetchAllProducts().then((products) => {
    // PCbuild.forEach((product) => {
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
      // If a motherboard is set
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

      if (gpu) {
        gpu.forEach((gpus) => {
          const gpuSpecs = gpus.specs.split(",");
          const gpuCon = gpuSpecs[0].trim().replace(/\s+/g, "");
          const moboCon = MOBO.specs[7].trim().replace(/\s+/g, "");

          if (moboCon !== gpuCon) {
            // PCbuild.pop(MOBO);
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

      //mobo to gpu

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
          const ggpuWattage = parseInt(gpuSpecs[2].trim().replace(/\s+/g, ""));
          const psuWattage = parseInt(PSU.specs[1].trim().replace(/\s+/g, ""));

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
        const moboSpecs = MOBO.specs[7].trim().replace(/\s+/g, "");
        const gpuCon = GPU.specs[0].trim().replace(/\s+/g, "");
        // const moboCon = moboSpecs[7].trim().replace(/\s+/g, "");

        if (moboSpecs !== gpuCon) {
          console.log(
            "Incompatible GPU and Motherboard: Different socket types.!!"
          );
        } else {
          // DO something here if compatible
          // if (
          //   !compatible_products.some(
          //     (existingProduct) =>
          //       JSON.stringify(existingProduct) === JSON.stringify(mobos)
          //   )
          // ) {
          //   // compatible_products.push(mobos);
          // }
          console.log("Selected GPU is compatabile with MOBO");
        }
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
          const storageInterface = Storage.specs[2].trim().replace(/\s+/g, "");
          const moboStorageInterface = moboSpecs[8].trim().replace(/\s+/g, "");
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
      // If CPU is selected
      // CPU to Motherboard
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
  });

  return compatible_products;
}

// Function to show products or placeholders in the dropdown
async function showChosenComponent(componentDiv, category) {
  if (currentOpenDropdown && currentOpenDropdown !== componentDiv) {
    currentOpenDropdown.classList.remove("show-components");
    currentOpenDropdown.classList.add("hide-components");
  }

  componentDiv.classList.toggle("show-components");

  if (componentDiv.classList.contains("show-components")) {
    componentDiv.classList.remove("hide-components");
    productsHTML = "";

    await fetchAllProducts()
      .then((products) => {
        // Filter products by category
        const filteredProducts = filterProductsByCategory(products, category);

        const comp_products = checkSpecCompatability();
        const filtered_comp_products = filterProductsByCategory(
          comp_products,
          category
        );
        // Show filtered products
        if (PCbuild.length > 0 && filtered_comp_products.length > 0) {
          filtered_comp_products.forEach((product) => {
            const productImage = product.product_image || "";
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
                      product.product_category === 5 ||
                      product.product_category === 6
                        ? `<div class="component-info text-end">
                            <label for="OrderQuantity">Quantity:</label>
                            <input type="number" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="2" style="width: 50px; height: 23px; font-size: 16px;">
                          </div>`
                        : ""
                    }
                    <div class="component-info text-end"><p class="text-end">+${
                      product.price
                    }</p></div>
                    
                          <span style="background-color: #4CAF50; color: white; padding: 2px 8px; font-size: 12px; border-radius: 5px; margin-left: 10px;">Compatible</span>
                        
                  </div>`;
          });
        } else if (
          PCbuild.length > 0 &&
          filtered_comp_products.length === 0 &&
          filteredProducts.length > 0
        ) {
          console.log("No Compatible");
          console.log(comp_products);
          comp_products.forEach((product) => {
            if (!product.contains(product_category == 7)) {
              componentDiv.innerHTML = `<div class="shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1"><p>No Compatible Products.</p></div>`;
            }
          });
        } else {
          filteredProducts.forEach((product) => {
            const productImage = product.product_image || "";
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
                  product.product_category === 5 ||
                  product.product_category === 6
                    ? `<div class="component-info text-end">
                        <label for="OrderQuantity">Quantity:</label>
                        <input type="number" id="OrderQuantity" name="OrderQuantity" value="1" min="1" max="2" style="width: 50px; height: 23px; font-size: 16px;">
                      </div>`
                    : ""
                }
                <div class="component-info text-end"><p class="text-end">+${
                  product.price
                }</p></div>
              </div>`;
          });
        }

        componentDiv.innerHTML = productsHTML;
      })

      .catch(() => {
        componentDiv.innerHTML = `<div class="shadow-none mx-3 bg-body-tertiary border border-dark-subtle border-bottom-0 fw-bold p-1"><p>Failed to load products.</p></div>`;
      });

    currentOpenDropdown = componentDiv;
  } else {
    componentDiv.classList.add("hide-components");
    currentOpenDropdown = null;
  }
}

// Function to enable the next component
function enableNextComponent() {
  // Check if specific products exist in the PCbuild array based on category
  if (PCbuild.some((product) => product.category == 4)) {
    // Enable the motherboard component
    const motherboardDiv = document.querySelector(".motherboard");
    if (motherboardDiv) {
      motherboardDiv.classList.remove("disabled-component");
    }
  }

  if (PCbuild.some((product) => product.category == 1)) {
    // Enable the CPU component
    const cpuDiv = document.querySelector(".cpu");
    if (cpuDiv) {
      cpuDiv.classList.remove("disabled-component");
    }
  }

  if (PCbuild.some((product) => product.category == 7)) {
    // Enable the GPU component
    const gpuDiv = document.querySelector(".gpu");
    if (gpuDiv) {
      gpuDiv.classList.remove("disabled-component");
    }
  }

  if (PCbuild.some((product) => product.category == 3)) {
    // Enable the RAM component
    const ramDiv = document.querySelector(".ram");
    if (ramDiv) {
      ramDiv.classList.remove("disabled-component");
    }
  }

  if (PCbuild.some((product) => product.category == 6)) {
    // Enable the storage component
    const storageDiv = document.querySelector(".storage");
    if (storageDiv) {
      storageDiv.classList.remove("disabled-component");
    }
  }

  if (PCbuild.some((product) => product.category == 5)) {
    // Enable the power supply component
    const powerSupplyDiv = document.querySelector(".power-supply");
    if (powerSupplyDiv) {
      powerSupplyDiv.classList.remove("disabled-component");
    }
  }
}

function disableNextComponent() {
  // var currentComponent = document.querySelector(currentComponentId);
  // var nextComponent = document.querySelector(nextComponentId);

  // Check if the current component has been selected (event triggered)
  if (PCbuild.some((product) => product.category == 4)) {
    const caseDiv = document.querySelector(".motherboard"); // Selects the first div with the 'case' class
    if (caseDiv) {
      caseDiv.classList.add("disabled-component");
    }
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

  //enable dropdown
  enableNextComponent();

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

  //SUmmary of Build
  // Update the corresponding category section with the product name
  const categoryKey = summarycategoryMapping[selectedProductObj.category];
  const categoryElement = document.getElementById(`${categoryKey}-category`);

  if (categoryElement) {
    categoryElement.innerHTML = `${selectedProductObj.name} - ₱${selectedProductObj.price}`;
  }

  //specs eme
  const specsDiv = document.getElementById("product_specs");

  // Define default labels
  const defaultLabels = ["Brand", "Color"];

  // Get category of the product (replace with actual category data)
  const productCategory = selectedProductObj.category; // Example: 'Motherboard'

  // Define category-specific labels
  let labels = [...defaultLabels]; // Start with default labels

  switch (productCategory) {
    case "1":
      labels = [
        "Brand",
        "Socket Type",
        "Chipset",
        "Form Factor",
        "Max RAM Capacity",
        "RAM Type",
        "RAM Slots",
        "PCIe Slots",
        "Storage Interfaces",
        "Ram Interfaces",
        "PCIe Power Connectors",
      ];

      break;
    case "7":
      labels = [
        "Brand",
        "Socket Compatibility",
        "Core Count",
        "Base Clock Speed",
        "Boost Clock Speed",
        "TDP",
        "Integrated Graphics",
      ];
      break;
    case "2":
      labels = [
        "Brand",
        "Wattage",
        "Efficiency Rating",
        "Form Factor",
        "Modular",
        "PCIe Power Connectors",
      ];
      break;
    case "3":
      labels = ["PCIe Version", "VRAM", "TDP", "Power Connectors", "Length"];
      break;
    case "4":
      labels = [
        "Form Factor",
        "Max GPU Length",
        "Max CPU Cooler Height",
        "Max PSU Length",
        "Drive Bays",
      ];
      break;
    case "5":
      labels = [
        "Storage Type",
        "Form Factor",
        "Interface",
        "Capacity",
        "Read/Write Speed",
      ];
      break;
    case "6":
      labels = ["RAM Type", "Capacity", "Frequency", "CAS Latency", "Voltage"];
      break;
    case "Peripherals":
      labels = ["Connection Type", "Features"];
      break;
    default:
      // Use default labels for undefined categories
      break;
  }

  // Now let's map the labels to their respective specs and display them
  const specs = selectedProductObj.specs; // The specs array (already split)

  // Build the HTML for the labels and their respective specs
  let specsHtml = "";
  labels.forEach((label, index) => {
    // Check if there is a corresponding spec
    const specValue = specs[index] || "N/A"; // Fallback to 'N/A' if no spec is available for this label
    specsHtml += `<ul class='ps-0' "><strong>${label}:</strong> ${specValue}</ul>`;
  });

  // Display the generated HTML in specsDiv
  if (specsDiv) {
    specsDiv.innerHTML = `<ul>${specsHtml}</ul>`;
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

//modal eme
const notificationModal = document.createElement("div");
notificationModal.innerHTML = `
  <div id="notification-modal" class="modal">
    <div class="modal-content">
      <img src="assets/imgs/loading-gif.gif" alt="Loading GIF" class="modal-gif" />
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

// Button selectors for different categories
const undo = document.querySelector(".undo");
const undoAllButton = document.getElementById("undoAll");
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
            window.location.href = "cart.php"; // Redirect to your desired page
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

//Undo event
undo.addEventListener("click", async () => {
  const summarycategoryMapping = {
    1: "motherboard",
    7: "cpu",
    2: "psu",
    4: "case",
    5: "storage",
    6: "ram",
    3: "gpu",
  };
  if (PCbuild.length > 0) {
    let lastElement = PCbuild[PCbuild.length - 1];
    const categoryKey = summarycategoryMapping[lastElement.category];
    const categoryElement = document.getElementById(`${categoryKey}-category`);
    if (categoryElement) {
      categoryElement.innerHTML = ``;
    }

    const lastElement_category = lastElement.category;

    //hide category dropdown
    if (lastElement_category === "1") {
      // alert("Removing Motherboard from selection.");
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".cpu");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing Motherboard from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "2") {
      const nextCatDiv = document.querySelector(".power-supply");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing Power-Supply from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "3") {
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".ram");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing GPU from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "4") {
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".motherboard");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing Case from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "5") {
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".power-supply");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing Storage from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "6") {
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".cpu");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing RAM from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
    if (lastElement_category === "7") {
      // Enable the motherboard component
      const nextCatDiv = document.querySelector(".gpu");
      if (nextCatDiv) {
        nextCatDiv.classList.add("disabled-component");
      }
      await PCbuild.pop();
      showNotification("Removing CPU from selection.");
      currentOpenDropdown.classList.add("hide-components");
      setTimeout(() => {
        hideNotification();
      }, 2000);
    }
  } else {
    alert("No Components selected, please select a component first.");
  }
});

//Undo all

undoAllButton.addEventListener("click", async () => {
  const summarycategoryMapping = {
    1: "motherboard",
    7: "cpu",
    2: "psu",
    4: "case",
    5: "storage",
    6: "ram",
    3: "gpu",
  };

  if (PCbuild.length > 0) {
    // Loop through each component in PCbuild and remove it
    while (PCbuild.length > 0) {
      let lastElement = PCbuild.pop();
      const categoryKey = summarycategoryMapping[lastElement.category];
      const categoryElement = document.getElementById(
        `${categoryKey}-category`
      );

      if (categoryElement) {
        categoryElement.innerHTML = ``; // Clear the category element
      }

      const lastElement_category = lastElement.category;

      // Disable corresponding components based on category
      if (lastElement_category === "1") {
        // alert("Removing Motherboard from selection.");
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".cpu");
        const CatDiv = document.querySelector(".motherboard");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing Motherboard from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "2") {
        const nextCatDiv = document.querySelector(".power-supply");
        if (nextCatDiv) {
          nextCatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing Power-Supply from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "3") {
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".gpu");
        const CatDiv = document.querySelector(".ram");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing GPU from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "4") {
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".case");
        const CatDiv = document.querySelector(".case");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing Case from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "5") {
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".storage");
        const CatDiv = document.querySelector(".power-supply");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing Storage from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "6") {
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".ram");
        const CatDiv = document.querySelector(".storage");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing RAM from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
      if (lastElement_category === "7") {
        // Enable the motherboard component
        const nextCatDiv = document.querySelector(".cpu");
        const CatDiv = document.querySelector(".gpu");
        if (nextCatDiv && CatDiv) {
          nextCatDiv.classList.add("disabled-component");
          CatDiv.classList.add("disabled-component");
        }
        await PCbuild.pop();
        showNotification("Removing CPU from selection.");
        currentOpenDropdown.classList.add("hide-components");
        setTimeout(() => {
          hideNotification();
        }, 2000);
      }
    }
  } else {
    alert("No Components selected, please select a component first.");
  }
});

// Event listeners for each category button
caseBtn.addEventListener("click", async () => {
  showNotification("Loading PC-Case Products");
  productsHTML = "";
  await showChosenComponent(showAllCase, 4); // Assuming 5 corresponds to 'Case'
  hideNotification();
});
motherboardBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatability");
  productsHTML = "";
  await showChosenComponent(showAllMotherboard, 1); // Assuming 1 corresponds to 'Motherboard'
  hideNotification();
});
cpuBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatibility");
  productsHTML = "";
  await showChosenComponent(showAllCpu, 7); // Assuming 7 corresponds to 'CPU'
  hideNotification();
});

gpuBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatibility");
  productsHTML = "";
  await showChosenComponent(showAllGpu, 3); // Assuming 3 corresponds to 'GPU'
  hideNotification();
});

ramBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatibility");
  productsHTML = "";
  await showChosenComponent(showAllRam, 6); // Assuming 6 corresponds to 'RAM'
  hideNotification();
});

storageBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatibility");
  productsHTML = "";
  await showChosenComponent(showAllStorage, 5); // Assuming 5 corresponds to 'Storage'
  hideNotification();
});

powerSupplyBtn.addEventListener("click", async () => {
  showNotification("Checking For Compatibility");
  productsHTML = "";
  await showChosenComponent(showAllPowerSupply, 2); // Assuming 2 corresponds to 'Power Supply'
  hideNotification();
});
