# Dapur Antar — payment, delivery & map additions

## What is included
- Payment choices: QRIS, GoPay, OVO, DANA, ShopeePay, and cash to courier.
- Checkout guidance changes based on the selected method.
- Optional delivery instructions.
- Google Maps destination embed and a link to open a route in Google Maps.
- A tracking panel with order status labels.

## Important: this is still a front-end demo
The payment options are UI demonstrations only. No QRIS payment QR is generated, no e-wallet charge is initiated, and no payment is verified. Never mark an order paid based only on a browser-side selection.

For real payments, integrate a payment gateway such as Midtrans or Xendit on a server:
1. Create a merchant account and obtain sandbox API credentials.
2. Add a backend endpoint that creates a payment session/order using the secret key (never put secret keys in `app.js` or HTML).
3. Return the provider's checkout URL or QRIS QR payload to the browser.
4. Verify payment status using a signed provider webhook on the backend before marking the order paid.
5. Test in sandbox mode before going live.

## Google Maps
The map currently uses a destination search embed and the route link opens Google Maps. It shows the customer's destination only, not a courier's live GPS location.

For production:
- If using the Google Maps Embed API or Maps JavaScript API, create a Google Cloud project, enable billing and the required API, then create an API key.
- Restrict the browser key by HTTP referrer and API; never use an unrestricted key.
- For live courier tracking, build a backend to receive courier GPS updates (with courier consent), store current coordinates, and expose authorized order-specific updates to the customer. Then update a Google Map marker from those coordinates.
- Keep server credentials private and validate that a customer can only access their own order.

## Run locally
Open `index.html` in a browser for the front-end demo. Account/order data is stored in local browser storage, so it is not a production backend.


## REST API for assignment testing
A Node/Express demo backend is included in `server.js`. See `README-API.md` and `API-TEST-REPORT.md`. Run `npm install` then `npm start` from this folder to test endpoints with Postman/cURL. The website UI is still a front-end demo; the backend is independently testable and does not yet replace the browser-local account/order logic.
