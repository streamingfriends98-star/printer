import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const startButton = document.querySelector('#start-ar');
const intro = document.querySelector('#intro');
const fallback = document.querySelector('#fallback-card');
const help = document.querySelector('#ar-help');
const exitButton = document.querySelector('#exit-ar');
const errorBox = document.querySelector('#error');
const statusText = document.querySelector('#camera-status');

let renderer, scene, camera, reticle, card, hitTestSource = null, localSpace = null;
let arSession = null;
let placed = false;

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}
function makeCardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1000; canvas.height = 580;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 1000, 580);
  grad.addColorStop(0, '#20333f'); grad.addColorStop(1, '#101820');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1000, 580);
  ctx.strokeStyle = '#e9c783'; ctx.lineWidth = 5; ctx.strokeRect(16, 16, 968, 548);
  ctx.fillStyle = '#e9c783'; ctx.font = 'bold 38px Arial'; ctx.fillText('SP', 58, 88);
  ctx.font = 'bold 24px Arial'; ctx.letterSpacing = '5px'; ctx.fillText('PRINTING • PACKAGING • SOLUTIONS', 150, 80);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 84px Arial'; ctx.fillText('STANDARD', 58, 245); ctx.fillText('PRINTERS', 58, 335);
  ctx.fillStyle = '#e9c783'; ctx.fillRect(60, 370, 120, 7);
  ctx.fillStyle = '#d0dbe1'; ctx.font = '28px Arial'; ctx.fillText('Ideas made visible.', 60, 430);
  ctx.fillStyle = '#e9c783'; ctx.fillRect(60, 465, 340, 62);
  ctx.fillStyle = '#101820'; ctx.font = 'bold 24px Arial'; ctx.fillText('STANDARDPRINTERS.CO.IN ↗', 78, 504);
  return new THREE.CanvasTexture(canvas);
}

async function startAR() {
  errorBox.hidden = true;
  if (!navigator.xr) {
    intro.hidden = true; fallback.hidden = false;
    showError('This browser does not support WebXR AR. The digital visiting card is shown instead. Try a supported Android phone using Chrome and HTTPS.');
    return;
  }
  try {
    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) throw new Error('Immersive AR is not supported on this device/browser.');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.setClearColor(0x000000, 0);
    document.querySelector('#app').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x667788, 2));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 3, 2); scene.add(light);

    const cardMaterial = new THREE.MeshBasicMaterial({ map: makeCardTexture(), transparent: true, side: THREE.DoubleSide });
    card = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.185), cardMaterial);
    card.visible = false; scene.add(card);

    const ring = new THREE.RingGeometry(0.075, 0.09, 32);
    reticle = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xe9c783, side: THREE.DoubleSide }));
    reticle.rotation.x = -Math.PI / 2; reticle.matrixAutoUpdate = false; reticle.visible = false; scene.add(reticle);

    arSession = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
    arSession.addEventListener('end', onSessionEnd);
    await renderer.xr.setSession(arSession);
    localSpace = await arSession.requestReferenceSpace('local');
    const viewerSpace = await arSession.requestReferenceSpace('viewer');
    hitTestSource = await arSession.requestHitTestSource({ space: viewerSpace });

    intro.hidden = true; fallback.hidden = true; help.hidden = false; exitButton.hidden = false;
    document.body.classList.add('ar-active');
    statusText.textContent = 'STANDARD PRINTERS · MOVE TO FIND A SURFACE';
    renderer.setAnimationLoop(renderFrame);
    renderer.domElement.addEventListener('click', placeCard);
  } catch (err) {
    console.warn(err);
    intro.hidden = true; fallback.hidden = false;
    showError((err && err.message ? err.message : 'Unable to start AR.') + ' Make sure this page is hosted on HTTPS and camera/motion permissions are allowed.');
  }
}

function renderFrame(timestamp, frame) {
  if (!frame || !hitTestSource) { renderer.render(scene, camera); return; }
  const hits = frame.getHitTestResults(hitTestSource);
  if (hits.length && !placed) {
    const pose = hits[0].getPose(localSpace);
    reticle.visible = true;
    reticle.matrix.fromArray(pose.transform.matrix);
  } else reticle.visible = false;
  renderer.render(scene, camera);
}
function placeCard() {
  if (!reticle || !reticle.visible || placed) return;
  card.position.setFromMatrixPosition(reticle.matrix);
  card.quaternion.setFromRotationMatrix(reticle.matrix);
  // Tilt the card slightly upright so it reads like a floating business card.
  card.rotateX(-Math.PI / 2);
  card.visible = true; placed = true; reticle.visible = false;
  help.textContent = 'Card placed. Tap the card to open Standard Printers website.';
  renderer.domElement.addEventListener('click', openWebsiteOnce, { once: true });
}
function openWebsiteOnce() {
  window.open('https://www.standardprinters.co.in/', '_blank', 'noopener');
  if (renderer && renderer.domElement) renderer.domElement.addEventListener('click', openWebsiteOnce, { once: true });
}
function onSessionEnd() {
  if (renderer) renderer.setAnimationLoop(null);
  if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  renderer = scene = camera = card = reticle = null;
  hitTestSource = localSpace = arSession = null; placed = false;
  document.body.classList.remove('ar-active');
  intro.hidden = false; fallback.hidden = true; help.hidden = true; exitButton.hidden = true;
  statusText.textContent = 'STANDARD PRINTERS · DIGITAL VISITING CARD';
}
startButton.addEventListener('click', startAR);
exitButton.addEventListener('click', () => arSession?.end());
