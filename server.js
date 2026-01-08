const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'dev-secret-key';

// Middleware d'authentification
function authenticate(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        console.log('❌ Authentication failed - Invalid API Key');
        return res.status(401).json({ 
            success: false, 
            error: 'Unauthorized - Invalid API Key' 
        });
    }
    
    next();
}

// Health check (sans auth)
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'SMS Webhook API - TEST Imaden18',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: 'GET /',
            webhook: 'POST /webhook/sms (requires X-API-Key header)',
            test: 'POST /test/sms (requires X-API-Key header)'
        }
    });
});

// Health check détaillé
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
    });
});

// Webhook SMS principal (PROTÉGÉ)
app.post('/webhook/sms', authenticate, (req, res) => {
    console.log('=================================');
    console.log('📱 WEBHOOK SMS REÇU');
    console.log('=================================');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('🔑 Headers:', JSON.stringify({
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for']
    }, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    console.log('=================================');
    
    const { mobileNumber, messageText, messageKey, shortCode, metadata } = req.body;
    
    // Validation
    if (!mobileNumber) {
        console.log('❌ Erreur: mobileNumber manquant');
        return res.status(400).json({
            success: false,
            error: 'mobileNumber est requis'
        });
    }
    
    if (!messageText) {
        console.log('❌ Erreur: messageText manquant');
        return res.status(400).json({
            success: false,
            error: 'messageText est requis'
        });
    }
    
    // Simuler l'envoi SMS
    console.log('✅ SMS validé:');
    console.log(`   📱 Destinataire: ${mobileNumber}`);
    console.log(`   💬 Message: ${messageText}`);
    console.log(`   🔑 Message Key: ${messageKey || 'N/A'}`);
    console.log(`   📲 Short Code: ${shortCode || 'N/A'}`);
    
    // TODO: ICI vous appelleriez vraiment Marketing Cloud
    // Exemple:
    // const mcResponse = await callMarketingCloud({
    //     phone: mobileNumber,
    //     message: messageText,
    //     shortCode: shortCode
    // });
    
    // Réponse de succès (simulated)
    const response = {
        success: true,
        requestId: 'WEBHOOK_' + Date.now(),
        messageKey: messageKey || 'N/A',
        status: 'QUEUED',
        timestamp: new Date().toISOString(),
        debug: {
            receivedFrom: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            processedAt: new Date().toISOString()
        }
    };
    
    console.log('📤 Réponse envoyée:', JSON.stringify(response, null, 2));
    console.log('=================================\n');
    
    res.json(response);
});

// Endpoint de test (PROTÉGÉ)
app.post('/test/sms', authenticate, (req, res) => {
    console.log('🧪 TEST SMS REÇU:', JSON.stringify(req.body, null, 2));
    
    res.json({
        success: true,
        message: 'Test reçu avec succès',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /webhook/sms',
            'POST /test/sms'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║     🚀 SMS Webhook API - TEST Imaden                   ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`🔒 API Key configurée: ${API_KEY === 'dev-secret-key' ? '⚠️  DEV MODE' : '✅'}`);
    console.log(`⏰ Démarré à: ${new Date().toISOString()}`);
    console.log('');
    console.log('📋 Endpoints disponibles:');
    console.log('   GET  /           - Health check');
    console.log('   GET  /health     - Health check détaillé');
    console.log('   POST /webhook/sms - Webhook principal (auth requis)');
    console.log('   POST /test/sms   - Endpoint de test (auth requis)');
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
});
```

---

### **3. Créer `.gitignore`**
```
node_modules/
npm-debug.log
.env
.DS_Store
*.log
