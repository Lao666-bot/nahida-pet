require('dotenv').config(); // 加载 .env 文件中的环境变量

const express = require('express');
const app = express();

// ---------- 全局错误捕获（防止进程静默崩溃）----------
process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获的异常:', err);
  // 不退出进程，保持服务运行（但记录错误）
});
process.on('unhandledRejection', (err) => {
  console.error('❌ 未处理的 Promise 拒绝:', err);
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ---------- 聊天接口 ----------
app.post('/api/chat', async (req, res) => {
  console.log('收到请求:', JSON.stringify(req.body, null, 2));

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.DASHSCOPE_API_KEY
      },
      body: JSON.stringify(req.body)
    });

    console.log('API 响应状态:', response.status);
    const data = await response.json();
    console.log('API 响应数据:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    console.error('代理捕获到错误:', err);
    res.status(500).json({
      output: {
        choices: [
          {
            message: {
              content: '代理服务器内部错误：' + err.message
            }
          }
        ]
      }
    });
  }
});

// 可选的 TTS 接口（已不再使用，保留但返回错误或直接删除）
// 如果希望保留，可以保留以下代码，但前端不会调用
app.post('/api/tts', async (req, res) => {
  res.status(404).json({ error: 'TTS 服务已停用，请使用浏览器语音' });
});

app.listen(3000, () => console.log('代理服务运行在 http://localhost:3000'));