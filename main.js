// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Initialize the 3D rendering context
const container = document.getElementById("3d-container");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0xffffff); // Background color
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
resizeRenderer();

// Create a basic scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  30,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
camera.position.set(2, 2, 4);

// OrbitControls setup for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.enableRotate = true;
controls.update();

// Load models using GLTFLoader
const loader = new GLTFLoader().setPath("public/pcbuildd/");
let currentModel = null;
let overlayContainer = null; // Reference to the image overlay container

function loadModel(modelPath, modelPosition, productImage) {
  // Remove the current model from the scene (if any)
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null; // Clear the reference to the current model
  }

  // Remove the current image overlay (if any)
  if (overlayContainer) {
    container.removeChild(overlayContainer);
    overlayContainer = null; // Clear the reference to the overlay container
  }

  // If modelPath exists, load the model
  if (modelPath) {
    loader.load(
      modelPath,
      (gltf) => {
        const mesh = gltf.scene;
        mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
        scene.add(mesh);
        currentModel = mesh; // Store the loaded model
      },
      undefined,
      (error) => {
        console.error("3D model not available.\n", error);

        // Fallback: Show the product image if model loading fails
        showProductImage(productImage);
      }
    );
  } else {
    // Fallback: Show the product image directly if no model path is provided
    showProductImage(productImage);
  }
}

// Function to display the product image as an overlay
function showProductImage(imagePath) {
  overlayContainer = document.createElement("div");
  overlayContainer.style.position = "absolute";
  overlayContainer.style.top = "0";
  overlayContainer.style.left = "0";
  overlayContainer.style.width = "100%";
  overlayContainer.style.height = "100%";
  overlayContainer.style.display = "flex";
  overlayContainer.style.justifyContent = "center";
  overlayContainer.style.alignItems = "center";
  overlayContainer.style.zIndex = "10"; // Make sure it's above the 3D container

  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = "Product Image";
  img.style.maxWidth = "80%"; // Adjust as needed
  img.style.maxHeight = "80%"; // Adjust as needed

  overlayContainer.appendChild(img);
  container.appendChild(overlayContainer);

  // Hide the image and remove 3D model on click
  img.addEventListener("click", () => {
    container.removeChild(overlayContainer);
    overlayContainer = null;

    if (currentModel) {
      scene.remove(currentModel);
      currentModel = null; // Clear the current model reference
    }
  });
}

// Listening for the event that triggers model loading
window.addEventListener("load3DModel", (event) => {
  const { path, image } = event.detail;

  // Load the model by passing the path received from the main app
  loadModel(path, { x: 0, y: 1.05, z: 0 }, image); // Passing image here as well
});

// Resize the renderer to fit the container size
function resizeRenderer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  resizeRenderer();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (currentModel) {
    currentModel.rotation.y += 0.005; // Slow rotation for viewing
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();
