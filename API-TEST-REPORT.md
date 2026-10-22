# Dapur Antar API — Validation / Test Report

**Project:** Dapur Antar food delivery demo  
**API version:** v1  
**Base URL:** `http://localhost:3000`  
**Test environment:** Local Node.js server; in-memory demo data  
**Status:** Implemented endpoints are suitable for manual Postman/cURL validation. Run the tests and record actual HTTP results before submitting this report. Do not claim tests passed until you have executed them.

## 1. API coverage

| Module | Endpoint | Expected success |
|---|---|---|
| Health | `GET /api/health` | `200` |
| Authentication | `POST /api/v1/auth/register` | `201` |
| Authentication | `POST /api/v1/auth/login` | `200`, bearer token |
| Profile | `GET /api/v1/profile` | `200`, requires token |
| Profile | `PUT /api/v1/profile` | `200`, requires token |
| Menu | `GET /api/v1/menu` | `200`, supports `category`, `search`, `sort` |
| Menu | `GET /api/v1/menu/:id` | `200` or `404` |
| Cart | `GET /api/v1/cart` | `200`, requires token |
| Cart | `POST /api/v1/cart/items` | `201`, requires token |
| Cart | `PATCH /api/v1/cart/items/:menuItemId` | `200`, requires token |
| Cart | `DELETE /api/v1/cart` | `200`, requires token |
| Promotions | `POST /api/v1/promotions/apply` | `200` valid voucher; `400` invalid/minimum not met |
| Delivery locations | `GET /api/v1/locations` | `200` |
| Orders | `POST /api/v1/orders` | `201`, requires token |
| Orders | `GET /api/v1/orders` | `200`, requires token |
| Orders | `GET /api/v1/orders/:orderId` | `200`, `403`, or `404` |
| Tracking | `GET /api/v1/orders/:orderId/tracking` | `200`, requires token |
| Payment demo | `POST /api/v1/payments` | `201`, sandbox placeholder only |
| Payment demo | `GET /api/v1/payments/:paymentId` | `200`, requires token |
| Payment webhook demo | `POST /api/v1/webhooks/payment` | `200` with secret; otherwise `401` |
| Tracking/admin demo | `PATCH /api/v1/orders/:orderId/status` | `200` with secret; otherwise `401` |

## 2. Test cases and expected outcomes

| ID | Scenario | Request / test data | Expected |
|---|---|---|---|
| TC-01 | Health check | `GET /api/health` | `200`, service/version returned |
| TC-02 | Register valid user | name, unique email, phone, password >= 8 chars | `201`, userId |
| TC-03 | Duplicate registration | Register same email again | `409` |
| TC-04 | Weak password | Password shorter than 8 chars | `400` |
| TC-05 | Login valid account | Registered email and password | `200`, token returned |
| TC-06 | Login invalid account | Wrong password | `401` |
| TC-07 | Menu search | `GET /api/v1/menu?search=ayam` | `200`, matching menu items |
| TC-08 | Sort menu | `GET /api/v1/menu?sort=price_asc` | `200`, ascending prices |
| TC-09 | Protected endpoint without token | `GET /api/v1/cart` without Authorization | `401` |
| TC-10 | Add valid cart item | `POST /api/v1/cart/items`, `{"menuItemId":"n1","quantity":2,"customizations":[]}` | `201`, subtotal = Rp56,000 |
| TC-11 | Invalid quantity | quantity `0` or `21` | `400` |
| TC-12 | Valid voucher | `{"promoCode":"SAVE10","cartSubtotal":50000}` | `200`, discount Rp5,000 |
| TC-13 | Invalid voucher | `{"promoCode":"NOPE","cartSubtotal":50000}` | `400` |
| TC-14 | List delivery areas | `GET /api/v1/locations` | `200`, area list |
| TC-15 | Checkout empty cart | `POST /api/v1/orders` with empty cart | `400` |
| TC-16 | Place order | Add cart item, then checkout with address, area and payment method | `201`, orderId and pricing |
| TC-17 | Access another user's order | Use other user's orderId | `403` |
| TC-18 | Invalid tracking status | status outside allowed list | `400` |
| TC-19 | Payment webhook unauthorized | omit/wrong `x-webhook-secret` | `401` |
| TC-20 | Payment webhook authorized | correct secret and status `PAID` | `200`, payment status updated |

## 3. Run the API

Requirements: Node.js 18+ and npm.

```bash
npm install
# Optional: set secrets in your shell before starting
# Windows PowerShell:
$env:JWT_SECRET="replace-this-secret"
$env:WEBHOOK_SECRET="replace-this-webhook-secret"
npm start
```

The API listens on `http://localhost:3000`. The current implementation uses in-memory data: users, carts, orders and payments reset whenever the server restarts.

## 4. Suggested Postman workflow

1. `GET http://localhost:3000/api/health`
2. Register with `POST /api/v1/auth/register`:
   ```json
   {"name":"Test User","email":"test1@example.com","phone":"081234567890","password":"TestPass123"}
   ```
3. Login with the same email/password using `POST /api/v1/auth/login`.
4. Copy `data.token` from the response. Add this header to protected requests:
   `Authorization: Bearer YOUR_TOKEN`
5. `GET /api/v1/menu?search=ayam`
6. `POST /api/v1/cart/items` with:
   ```json
   {"menuItemId":"n1","quantity":2,"customizations":[]}
   ```
7. `POST /api/v1/promotions/apply` with:
   ```json
   {"promoCode":"SAVE10","cartSubtotal":56000}
   ```
8. `POST /api/v1/orders` with:
   ```json
   {"deliveryAddress":"Jl. Sudirman No. 45, Jakarta","area":"Menteng","paymentMethod":"QRIS","promoCode":"SAVE10","deliveryInstructions":"Call on arrival"}
   ```
9. Use returned `data.orderId` in `GET /api/v1/orders/ORDER_ID` and `GET /api/v1/orders/ORDER_ID/tracking`.

## 5. Example cURL

```bash
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/v1/menu?search=ayam&sort=price_asc"
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test1@example.com","phone":"081234567890","password":"TestPass123"}'
```

For protected requests, add `-H "Authorization: Bearer YOUR_TOKEN"`.

## 6. Scope, limitations and security notes

- This is a learning/demo API. It uses in-memory storage and a simple opaque bearer token registry, not production JWTs or a database.
- Payment endpoints are **simulation placeholders**. They do not create real QRIS codes or charge GoPay/OVO/DANA/ShopeePay. Use a payment gateway sandbox and signed provider webhooks for real payment integration.
- Delivery tracking reports order status changes, not a courier's live GPS coordinates. A real tracking map requires courier location updates, authorization and a map provider key.
- The demo webhook secret is configurable. Use strong environment secrets and provider signature verification in production.
- CORS is permissive for local development; restrict origins before deployment.
- Passwords are stored as salted scrypt hashes in memory. Add rate limiting, persistent database storage, stronger token expiry/revocation, input schemas, logging, and automated tests before production.
- The existing website frontend remains a browser-side demo. These API routes can be tested independently with Postman or cURL; frontend integration is a separate step.
