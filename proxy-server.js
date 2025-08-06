const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3002;

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// 프록시 설정
app.use('/api', createProxyMiddleware({
  target: 'http://20.249.136.139',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v0/mcp'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('프록시 요청:', req.method, req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('프록시 응답:', proxyRes.statusCode);
  }
}));

app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
}); 
