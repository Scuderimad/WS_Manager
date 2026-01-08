const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'dev-secret-key';

function authenticate(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        console.log('Authentication failed');
        return res.status(401).json({ 
            success: false, 
            error: 'Unauthorized' 
        });
    }
    
    next();
}

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'SMS Webhook API',
        timestamp: new Date().toISOString()
    });
});

app.post('/webhook/sms', authenticate, (req, res) => {
    console.log('===================================');
    console.log('SMS WEBHOOK RECEIVED');
    console.log('===================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { mobileNumber, messageText, messageKey, shortCode } = req.body;
    
    if (!mobileNumber || !messageText) {
        return res.status(400).json({
            success: false,
            error: 'mobileNumber and messageText required'
        });
    }
    
    console.log('SMS validated:');
    console.log('  Phone:', mobileNumber);
    console.log('  Message:', messageText);
    console.log('  Key:', messageKey);
    console.log('===================================');
    
    const response = {
        success: true,
        requestId: 'WEBHOOK_' + Date.now(),
        messageKey: messageKey || 'N/A',
        status: 'QUEUED',
        timestamp: new Date().toISOString()
    };
    
    console.log('Response:', JSON.stringify(response, null, 2));
    
    res.json(response);
});

app.post('/test/sms', authenticate, (req, res) => {
    console.log('TEST SMS:', JSON.stringify(req.body, null, 2));
    
    res.json({
        success: true,
        message: 'Test received',
        data: req.body,
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found'
    });
});

app.listen(PORT, () => {
    console.log('=======================================');
    console.log('SMS Webhook API - Louis Vuitton');
    console.log('=======================================');
    console.log('Server started on port', PORT);
    console.log('API Key:', API_KEY === 'dev-secret-key' ? 'DEV MODE' : 'CONFIGURED');
    console.log('Time:', new Date().toISOString());
    console.log('=======================================');
});
```

---

### **📄 Fichier 3 : `.gitignore`**

Créez un nouveau fichier nommé `.gitignore` :
```
node_modules
npm-debug.log
.env
.DS_Store
