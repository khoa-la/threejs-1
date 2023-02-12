import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//Canvas
const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.set(-10, 30, 30);
scene.add(camera);

const orbit = new OrbitControls(camera, canvas);
orbit.update();

const renderer = new THREE.WebGL1Renderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  "/static/stars.jpg",
  "/static/stars.jpg",
  "/static/stars.jpg",
  "/static/stars.jpg",
  "/static/stars.jpg",
  "/static/stars.jpg",
]);

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load("/static/sun.jpg"),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const createPlanet = (size, texture, position, ring) => {
  const geometry = new THREE.SphereGeometry(size, 30, 30);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geometry, material);
  const object = new THREE.Object3D();
  object.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    object.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(object);
  mesh.position.x = position;
  return { mesh, object };
};

const mercury = createPlanet(3.2, "/static/mercury.jpg", 28);
const venus = createPlanet(5, 8, "/static/venus.jpg", 44);
const earth = createPlanet(6, "/static/earth.jpg", 62);
const mars = createPlanet(7, "/static/mars.jpg", 78);
const jupiter = createPlanet(12, "/static/jupiter.jpg", 100);
const saturn = createPlanet(10, "/static/saturn.jpg", 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: "/static/saturn ring.png",
});
const uranus = createPlanet(7, "/static/uranus.jpg", 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: "/static/uranus ring.png",
});
const neptune = createPlanet(7, "/static/neptune.jpg", 200);
const pluto = createPlanet(2.8, "/static/pluto.jpg", 216);

const animation = () => {
  // console.log(intersects);
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  mercury.object.rotateY(0.04);
  venus.object.rotateY(0.015);
  earth.object.rotateY(0.01);
  mars.object.rotateY(0.008);
  jupiter.object.rotateY(0.002);
  saturn.object.rotateY(0.0009);
  uranus.object.rotateY(0.0004);
  neptune.object.rotateY(0.0001);
  pluto.object.rotateY(0.00007);

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animation);

window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
