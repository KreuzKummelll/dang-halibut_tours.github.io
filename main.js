import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry,material);

// scene.add(torus);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,15,5);

const ambiantLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambiantLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

let theBoneyard = new Object3D();

loader.load(
  'theboneyard.glb', 
  
function (gltb) {
  theBoneyard = gltb.scene.children[0];

  scene.add(theBoneyard);

  theBoneyard.position.y = -5;
  theBoneyard.position.z = -5;
}, 
(xhr) => {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
},  function(error){
  console.log(error);
});




function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);

  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('castle-dome-lady.jpg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonNormal = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
new THREE.SphereGeometry(100,320,320),
new THREE.MeshStandardMaterial({
  map:moonTexture,
  normalMap: moonNormal,
  })
);

scene.add(moon);

moon.position.x = 500;
moon.position.y = 500;
moon.position.z = -1000;





function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.01;

  theBoneyard.rotation.y += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene,camera);
}

animate();  