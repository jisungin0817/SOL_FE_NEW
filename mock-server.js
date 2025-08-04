const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 테스트 엔드포인트
app.get('/test', (req, res) => {
  res.json({ message: 'Mock 서버가 정상 작동 중입니다!' });
});

// SSE 스트리밍 응답
app.post('/api/v1/chat/completions', async (req, res) => {
  console.log('API 요청 받음:', req.method, req.url);
  console.log('요청 헤더:', req.headers);
  
     try {
     res.setHeader('Content-Type', 'text/event-stream');
     res.setHeader('Cache-Control', 'no-cache, no-transform');
     res.setHeader('Connection', 'keep-alive');
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('X-Accel-Buffering', 'no'); // Nginx 버퍼링 방지
     res.setHeader('Transfer-Encoding', 'chunked');

    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    console.log('받은 메시지:', userMessage);

  // 1. 먼저 로딩 응답 (즉시)
  res.write(`data: ${JSON.stringify({
    sub_data: { type: 'loading' }
  })}\n\n`);
  
  // 실제 처리 시간 시뮬레이션 (0.5초)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 2. 텍스트 응답 (1초 후) - 진짜 SSE 스트리밍
  setTimeout(async () => {
    const responseText = `"${userMessage}"에 대한 답변입니다.`;
    
    // 진짜 SSE: 한 글자씩 실시간으로 전송
    for (let i = 0; i < responseText.length; i++) {
      const currentText = responseText.substring(0, i + 1);
      res.write(`data: ${JSON.stringify({
        main_answer: [{ text: currentText }]
      })}\n\n`);
      
      // 실제 처리 시간 시뮬레이션 (30ms - 더 빠르게)
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }, 1000);

    // 3. 컴포넌트 응답 (2초 후) - 진짜 SSE 스트리밍
  setTimeout(async () => {
          if (userMessage.includes('카드') || userMessage.includes('card')) {
        res.write(`data: ${JSON.stringify({
          type: 'component',
          sub_data: [
            {
              type: 'card',
              data: [
                {
                  product_name: '신한카드',
                  product_sub_name: '플래티넘',
                  button_text: '상세보기',
                  action: 'card_detail'
                },
                {
                  product_name: '신한카드',
                  product_sub_name: '골드',
                  button_text: '신청하기',
                  action: 'card_apply'
                }
              ]
            }
          ]
        })}\n\n`);
                   } else if (userMessage.includes('그래프') || userMessage.includes('chart')) {
        res.write(`data: ${JSON.stringify({
          type: 'component',
          sub_data: [
            {
              type: 'graph',
              data: {
                title: '포트폴리오 현황',
                description: '현재 투자 포트폴리오 비율입니다.',
                portfolio: {
                  fund: 60,
                  savings: 40,
                  fundLabel: '펀드',
                  savingsLabel: '적금'
                }
              }
            }
          ]
        })}\n\n`);
                   } else if (userMessage.includes('테이블') || userMessage.includes('table')) {
        res.write(`data: ${JSON.stringify({
          type: 'component',
          sub_data: [
            {
              type: 'chart',
              data: {
                chartTitle: '월별 수익률',
                chartData: [10, 15, 8, 20, 12, 18],
                description: {
                  main: '최근 6개월 수익률 추이',
                  sub: '안정적인 상승세를 보이고 있습니다.',
                  note: '* 기준일: 2024년 12월'
                }
              }
            }
          ]
        })}\n\n`);
         }
   }, 2000);

  // 4. 스트림 완료 (3초 후)
  setTimeout(() => {
    res.write('data: [DONE]\n\n');
    res.end();
  }, 3000);
  
  } catch (error) {
    console.error('API 처리 중 에러:', error);
    res.status(500).json({ error: '서버 내부 오류' });
  }
});

app.listen(port, () => {
  console.log(`Mock API 서버가 http://localhost:${port}에서 실행 중입니다.`);
  console.log('테스트 키워드:');
  console.log('- "카드" 또는 "card": 카드 컴포넌트 응답');
  console.log('- "그래프" 또는 "chart": 그래프 컴포넌트 응답');
  console.log('- "테이블" 또는 "table": 테이블 컴포넌트 응답');
  console.log('- 기타: 텍스트 응답만');
}); 