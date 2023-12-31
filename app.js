const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express()

app.use('/api', createProxyMiddleware({ target: 'https://redshop.io', changeOrigin: true }));
app.listen(3000);
module.exports = app