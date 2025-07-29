const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();

const LOCAL_HOST = 'http://14.241.120.142:31401'; // Ganti dengan IP+PORT server kamu
const TARGET_HOST = 'https://138.68.40.95'; // IP server Pi Network

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware proxy
app.use('/', async (req, res) => {
    const targetUrl = TARGET_HOST + req.originalUrl;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: 'api.mainnet.minepi.com',
            },
            data: req.body,
            timeout: 15000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // abaikan sertifikat self-signed
        });

        let data = response.data;

        // Hanya ubah jika isinya JSON dan punya _links
        if (typeof data === 'object' && data._links) {
            let jsonStr = JSON.stringify(data);
            jsonStr = jsonStr.replace(/https:\/\/api\.mainnet\.minepi\.com/g, LOCAL_HOST)
                             .replace(/https:\/\/138\.68\.40\.95/g, LOCAL_HOST); // kalau dari IP langsung
            data = JSON.parse(jsonStr);
        }

        res.status(response.status).json(data);
    } catch (error) {
        const status = error.response?.status || 500;
        const errData = error.response?.data || { error: error.message };
        res.status(status).json(errData);
    }
});

const PORT = 31401;
app.listen(PORT, () => {
    console.log(`✅ Proxy jalan di ${LOCAL_HOST}`);
});
