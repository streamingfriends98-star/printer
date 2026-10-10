STANDARD PRINTERS — AUTO-OPEN CAMERA CAROUSEL
==============================================
This version removes the "Start Live AR View" button and attempts to open the live
camera automatically when the QR-linked page loads. The transparent two-slide card
carousel appears over the camera feed.

Slide 1: Standard Printers + services
Slide 2: phone numbers + email

IMPORTANT LIMITATION:
- Browsers cannot be forced to grant camera permission. On first visit, the user may still
  have to approve the browser's camera permission prompt. If denied, they must allow it in
  site settings and reload.
- Host on HTTPS; localhost is also treated as a secure context for development.
- This uses a live camera video background, not spatially tracked WebXR passthrough AR.
  It does not anchor the card to a physical surface or track the environment.
- True WebXR immersive AR generally requires a user gesture and device/browser support,
  so a no-tap automatic launch cannot be guaranteed.
- Test on the target phone and browser before printing the QR.
- The included QR is a placeholder: regenerate it with the final hosted HTTPS URL.
