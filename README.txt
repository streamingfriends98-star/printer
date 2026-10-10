STANDARD PRINTERS — REFINED LIVE CAMERA CAROUSEL
================================================
Files:
- index.html
- style.css
- app.js
- qr_code_placeholder.png (placeholder only)

Fixes in this revision:
- Carousel is visible immediately and does not depend on camera startup.
- Explicit [hidden] CSS rule prevents hidden attributes being overridden by layout styles.
- Automatic camera startup with rear-facing camera preference.
- Clear camera status and recovery message if permission or HTTPS prevents camera access.
- Retry Camera and Switch Camera controls.
- Slide arrows, dots and swipe gestures.
- Mobile-height layout refinements.

Slide 1: Standard Printers + service list.
Slide 2: Contact numbers and email.

IMPORTANT:
1. Upload all files to HTTPS hosting. Camera access does not work from most plain HTTP URLs.
2. Browsers cannot silently grant camera permission. A first-visit permission prompt may appear.
3. The QR placeholder must be regenerated to point to the final hosted HTTPS page.
4. This version shows a live camera video behind a transparent carousel, not spatially anchored WebXR AR.
5. Service/contact copy should be checked against the current company website before printing.

ANIMATION UPDATE
- Animated cinematic card reveal on page opening and each slide change.
- Staggered logo, headings, service list, contact details and CTA text entrances.
- Gold underline sweep, subtle live indicator pulse, and button micro-interactions.
- Honors the device's reduced-motion accessibility preference.

NAVIGATION UPDATE
- Previous/next chevron arrows are positioned at the left and right sides of the card itself.
- Bottom row now contains only the slide dots and swipe hint.
