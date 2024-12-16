import redTextureImage from "./assets/red_texture.jpg";
import blueTextureImage from "./assets/blue_texture.jpg";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a material and embed it with textures
// Sub.1 - Red texture and material for left Christmas ball
const geometry = new THREE.SphereGeometry(1.5, 32, 32);

const redTexture = new THREE.TextureLoader().load(redTextureImage);
redTexture.wrapS = THREE.RepeatWrapping;
redTexture.wrapT = THREE.RepeatWrapping;
redTexture.repeat.set(2, 1);

const redMaterial = new THREE.MeshLambertMaterial({ map: redTexture });

// Sub.2 - Blue texture and material for right Christmas ball

const blueTexture = new THREE.TextureLoader().load(blueTextureImage);
blueTexture.wrapS = THREE.RepeatWrapping;
blueTexture.wrapT = THREE.RepeatWrapping;
blueTexture.repeat.set(1.2, 1.1);

const blueMaterial = new THREE.MeshLambertMaterial({ map: blueTexture });

// Create the Christmas balls
const ball1 = new THREE.Mesh(geometry, redMaterial);
const ball2 = new THREE.Mesh(geometry, blueMaterial);
ball1.position.set(-2, 0, 0);
ball2.position.set(2, 0, 0);

// Add the Christmas balls to the scene
scene.add(ball1);
scene.add(ball2);

// Create a light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Create a GUI controller for the light
const gui = new dat.GUI();
const ball1Controller = {
  x: ball1.position.x,
  y: ball1.position.y,
  z: ball1.position.z,
};
const ball1Folder = gui.addFolder("Ball 1");
ball1Folder.add(ball1Controller, "x", -2, 2).onChange(function (value) {
  ball1.position.x = value;
});
ball1Folder.add(ball1Controller, "y", -2, 2).onChange(function (value) {
  ball1.position.y = value;
});
ball1Folder.add(ball1Controller, "z", -2, 2).onChange(function (value) {
  ball1.position.z = value;
});

// Create a GUI controller for the second ball
const ball2Controller = {
  x: ball2.position.x,
  y: ball2.position.y,
  z: ball2.position.z,
};
const ball2Folder = gui.addFolder("Ball 2");
ball2Folder.add(ball2Controller, "x", -2, 2).onChange(function (value) {
  ball2.position.x = value;
});
ball2Folder.add(ball2Controller, "y", -2, 2).onChange(function (value) {
  ball2.position.y = value;
});
ball2Folder.add(ball2Controller, "z", -2, 2).onChange(function (value) {
  ball2.position.z = value;
});

// rotating ball logic + spped delay onmouseleave

const rotationSpeed = 0.01;
const rotationStopDelay = 1000;

function rotationStart(ball) {
  ball.isRotating = true;
}

function rotationStop(ball) {
  ball.isRotating = false;
  ball.stopTime = Date.now();
}

/* renderer.domElement.addEventListener("mousedown", () => {
  rotationStart(ball1);
  rotationStart(ball2);
});

renderer.domElement.addEventListener("mouseup", () => {
  rotationStop(ball1);
  rotationStop(ball2);
});

renderer.domElement.addEventListener("mouseleave", () => {
  rotationStop(ball1);
  rotationStop(ball2);
}); */

// Set up the raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add an event listener for the mousedown event
renderer.domElement.addEventListener("mousedown", (e) => {
  // Calculate the mouse position in normalized device coordinates
  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // Set the raycaster to cast a ray from the camera to the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Get an array of objects that intersect with the ray
  const intersects = raycaster.intersectObjects([ball1, ball2]);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    // Get the first intersected object
    const object = intersects[0].object;

    // Check if the object is already rotating
    object.isRotating ? rotationStop(object) : rotationStart(object);
  }
});

/* // Add an event listener for the mouseup event
renderer.domElement.addEventListener("mouseup", (e) => {
  // Calculate the mouse position in normalized device coordinates
  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // Set the raycaster to cast a ray from the camera to the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Get an array of objects that intersect with the ray
  const intersects = raycaster.intersectObjects([ball1, ball2]);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    // Get the first intersected object
    const object = intersects[0].object;

    // Stop rotating the object
    rotationStop(object);
  }
});

// Add an event listener for the mouseleave event
renderer.domElement.addEventListener("mouseleave", (e) => {
  // Calculate the mouse position in normalized device coordinates
  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // Set the raycaster to cast a ray from the camera to the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Get an array of objects that intersect with the ray
  const intersects = raycaster.intersectObjects([ball1, ball2]);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    // Get the first intersected object
    const object = intersects[0].object;

    // Stop rotating the object
    rotationStop(object);
  }
});

 */
function updateBallRotation(ball) {
  // Check if the ball is rotating
  if (ball.isRotating) {
    // Rotate the ball
    ball.rotation.y += rotationSpeed;
  } else {
    // Check if the delay has expired
    const elapsedTime = Date.now() - ball.stopTime;
    if (elapsedTime > rotationStopDelay) {
      // Stop rotating the ball
      ball.rotation.y = 0;
    }
  }
}

// Render the scene
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  updateBallRotation(ball1);
  updateBallRotation(ball2);
}
render();
