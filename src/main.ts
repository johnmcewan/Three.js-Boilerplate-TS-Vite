import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

// Load the 3D model
const loader = new GLTFLoader();
let model;

loader.load(
  '3D_TP_export.glb', // Path to your GLB file
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Add GUI controls for the model
    const modelFolder = gui.addFolder('Model');
    modelFolder.add(model.rotation, 'x', 0, Math.PI * 2);
    modelFolder.add(model.rotation, 'y', 0, Math.PI * 2);
    modelFolder.add(model.rotation, 'z', 0, Math.PI * 2);
    modelFolder.open();
  },
  undefined, // Progress callback (optional)
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Camera GUI controls
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z', 0, 20);
cameraFolder.open();

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Update stats
  stats.update();
}

animate();