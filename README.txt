STANDARD PRINTERS — WEB AR VISITING CARD
========================================

WHAT THIS PROJECT DOES
- Opens from a QR code in a mobile browser.
- On supported phones, starts a transparent WebXR AR session.
- Lets the visitor find a surface and place a floating Standard Printers digital card.
- The card includes a link-style callout; tapping the card opens:
  https://www.standardprinters.co.in/
- Includes a normal digital-card fallback for unsupported browsers.

IMPORTANT REAL-WORLD LIMITATIONS
1. This is a WebAR experience, not a transparent version of the full external website.
   The external site is opened separately because many websites block being embedded
   in another page, and normal web pages are not transparent.
2. WebXR immersive AR support varies by phone/browser. Current support is strongest on
   compatible Android devices using Chrome. iPhones may show the fallback page.
3. A QR code can open the experience, but it cannot bypass browser permission/security
   requirements. The visitor must tap "Start AR Experience" to start the camera/AR session.
4. Host the files on HTTPS. Camera/WebXR generally will not work on ordinary HTTP hosting.
5. The QR code supplied in this package points to the placeholder URL below. Regenerate
   the QR after uploading to your final public HTTPS URL.

FILES
- index.html: page structure
- style.css: visual design
- app.js: WebXR AR logic
- qr_code_placeholder.png: QR for a placeholder URL; replace it after deployment

HOW TO DEPLOY
1. Upload index.html, style.css and app.js into a folder on a hosting service that supports HTTPS.
2. Example final URL: https://yourdomain.com/standard-printers-ar/
3. Create a QR code that points to that exact URL (not directly to the company website).
4. Print that QR code on the visiting card.
5. Scan it with a compatible phone. Tap Start AR Experience, move the phone slowly until
   a surface reticle appears, then tap to place the floating card.

TESTING
- Test on a real supported phone, not only desktop preview.
- Allow camera/motion permissions if prompted.
- Ensure app.js and style.css are uploaded beside index.html.
- The app imports Three.js from jsDelivr, so the device needs internet access.

CUSTOMIZATION
- Change company name/card design in makeCardTexture() in app.js.
- Change the fallback card in index.html and style.css.
- The current design uses a text-based SP mark. Replace with an approved company logo if available.
