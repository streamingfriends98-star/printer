(() => {
  const video = document.getElementById('camera');
  const status = document.getElementById('camera-status');
  const message = document.getElementById('camera-message');
  const messageText = document.getElementById('camera-message-text');
  const retry = document.getElementById('retry-camera');
  const switchBtn = document.getElementById('switch-camera');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const currentNumber = document.getElementById('current-number');
  const carousel = document.getElementById('carousel');
  let slideIndex = 0, stream = null, frontCamera = false, touchStartX = null;

  // Always render the carousel even if camera permission is denied or unsupported.
  function showSlide(next) {
    slideIndex = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
    currentNumber.textContent = String(slideIndex + 1).padStart(2, '0');
  }
  document.getElementById('prev').addEventListener('click', () => showSlide(slideIndex - 1));
  document.getElementById('next').addEventListener('click', () => showSlide(slideIndex + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.to))));
  carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
  carousel.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) showSlide(slideIndex + (dx < 0 ? 1 : -1));
    touchStartX = null;
  }, {passive:true});

  async function startCamera() {
    message.hidden = true;
    if (!window.isSecureContext) {
      status.textContent = 'HTTPS REQUIRED';
      messageText.textContent = 'Camera access needs HTTPS (or localhost). The carousel remains visible over the preview background.';
      message.hidden = false;
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'CAMERA UNSUPPORTED';
      messageText.textContent = 'This browser does not offer camera access. The carousel is still available.';
      message.hidden = false;
      return;
    }
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      status.textContent = 'REQUESTING CAMERA';
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: frontCamera ? 'user' : { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1920 } }
      });
      video.srcObject = stream;
      await new Promise((resolve, reject) => {
        if (video.readyState >= 2) return resolve();
        video.onloadedmetadata = () => video.play().then(resolve).catch(reject);
        setTimeout(() => video.readyState >= 2 ? resolve() : reject(new Error('Camera stream did not become ready.')), 8000);
      });
      await video.play();
      status.textContent = 'LIVE CAMERA';
      switchBtn.hidden = false;
      message.hidden = true;
    } catch (err) {
      console.warn('Camera startup failed:', err);
      status.textContent = 'CAMERA PERMISSION NEEDED';
      messageText.textContent = err && err.name === 'NotAllowedError'
        ? 'Camera permission was denied or blocked. Allow camera access in your browser/site settings, then tap Retry camera. The carousel stays visible.'
        : 'Could not start the camera. Open this page on HTTPS in a supported mobile browser, allow camera access, and tap Retry camera.';
      message.hidden = false;
    }
  }
  retry.addEventListener('click', startCamera);
  switchBtn.addEventListener('click', async () => { frontCamera = !frontCamera; await startCamera(); });
  window.addEventListener('pagehide', () => { if (stream) stream.getTracks().forEach(track => track.stop()); });

  showSlide(0);
  // Browser permission cannot be bypassed; attempt automatically, but keep cards visible.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startCamera, {once:true});
  else startCamera();
})();