# SMS Webhook API

API pour recevoir les webhooks SMS depuis Salesforce.

## Endpoints

- GET / - Health check
- POST /webhook/sms - Webhook principal (auth required)
- POST /test/sms - Test endpoint (auth required)

## Auth

Header: `X-API-Key: YOUR_SECRET_KEY`

## Deploy

Auto-deployed on Render.com from GitHub.
