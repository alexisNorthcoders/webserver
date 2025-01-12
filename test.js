// testing proxy middleware

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {HttpsProxyAgent} = require('https-proxy-agent');

const app = express();
const PORT = 1111;

const proxyAgent = new HttpsProxyAgent(
    `http://130.162.180.254:8888`,
);
app.use(
  '/',
  createProxyMiddleware({
    target: 'https://www.reddit.com',
    agent:proxyAgent,
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});