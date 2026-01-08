# SMS Webhook API - TEST
API Webhook pour réceptionner et traiter les requêtes SMS OTP depuis Salesforce.

## 🚀 Endpoints

### Health Check
```bash
GET /
GET /health
```

### Webhook SMS
```bash
POST /webhook/sms
Headers: X-API-Key: YOUR_SECRET_KEY
Body: {
  "mobileNumber": "+33754569164",
  "messageText": "TEST - Code: 123456",
  "messageKey": "OTP_12345",
  "shortCode": "12345"
}
```

## 🔒 Sécurité

L'API nécessite une clé API dans le header `X-API-Key`.

Configurer via variable d'environnement `API_KEY` sur Render.

## 🛠️ Développement Local
```bash
npm install
npm start
```

## 📦 Déploiement

Déployé automatiquement sur Render.com depuis GitHub.
