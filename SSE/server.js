const express = require('express');
const app = express();

// SSE 路由
app.get('/sse', (req, res) => {
    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许跨域

    // 设置重连时间（5秒）
    res.write('retry: 3000\n\n');

    // 发送初始数据
    res.write('data: Connected\n\n');

    // 定时推送数据
    const intervalId = setInterval(() => {
        const data = JSON.stringify({ time: new Date().toISOString() });
        res.write(`data: ${data}\n\n`); // 每条消息以 "data:" 开头，以 "\n\n" 结尾
    }, 1000);

    // 处理客户端断开连接
    req.on('close', () => {
        clearInterval(intervalId); // 清除定时器
        res.end(); // 结束响应
    });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});