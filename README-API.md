# Dapur Antar API

## Start
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000/api/health`.

## API documentation and QA report
See `API-TEST-REPORT.md` for endpoint list, example requests, test cases, and limitations.

## Important
This is a demo API for coursework. Data is in memory and resets on restart. Payment methods are not connected to real payment providers; tracking is status-based and does not provide live courier GPS. Do not use real customer credentials or treat demo payment statuses as real payments.

## Interactive API documentation (OpenAPI / Swagger UI)
- Spec: `docs/openapi.yaml` (OpenAPI 3.0.3, 21 operations).
- With the server running, open `http://localhost:3000/docs/` for Swagger UI. Log in via `POST /api/v1/auth/login`, press **Authorize**, and paste `data.token`.
- Import into Postman: Import -> `docs/openapi.yaml`.
