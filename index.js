const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 31401; // Ganti sesuai kebutuhan

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy endpoint: meneruskan ke 138.68.40.95 IP Pinetwork
app.use('/proxy', async (req, res) => {
    const targetUrl = 'https://138.68.40.95' + req.originalUrl.replace('/proxy', '');
    
    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: '138.68.40.95', // penting agar tidak konflik
            },
            data: req.body,
            timeout: 10000,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // jika SSL self-signed
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: error.message };
        res.status(status).json(data);
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Proxy aktif di http://localhost:${PORT}`);
});
