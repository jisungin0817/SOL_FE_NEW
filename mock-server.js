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
    
    // 2. "찾는중..."과 "찾고있습니다..잠시만요" 동시 스트리밍
    const loadingText = "찾는중...";
    const searchingText = "찾고있습니다..잠시만요";
    
    // 더 긴 텍스트 기준으로 스트리밍
    const maxLength = Math.max(loadingText.length, searchingText.length);
    
    for (let i = 0; i < maxLength; i++) {
      const currentLoadingText = i < loadingText.length ? loadingText.substring(0, i + 1) : loadingText;
      const currentSearchingText = i < searchingText.length ? searchingText.substring(0, i + 1) : searchingText;
      
      res.write(`data: ${JSON.stringify({
        main_answer: [{ text: currentSearchingText }],
        sub_data: { 
          type: 'loading',
          loading_text: currentLoadingText
        }
      })}\n\n`);
      
      // 100ms 간격으로 한 글자씩
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 3. 통합 응답 - 새로운 백엔드 구조
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userMessage.includes('카드') || userMessage.includes('card')) {
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`
        }],
        sub_data: [
          {
            type: 'card',
            data: [
              {
                product_name: '신한카드',
                product_sub_name: '플래티넘',
                amount: '500,000'
              },
              {
                product_name: '신한카드',
                product_sub_name: '골드',
                amount: '300,000'
              }
            ]
          }
        ],
        ad_data: {
          title: '카드 추천',
          description: '고객님께 맞는 카드를 추천드립니다.',
          action: 'card_recommendation'
        }
      })}\n\n`);
    } else if (userMessage.includes('그래프') || userMessage.includes('chart')) {
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`
        }],
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
        ],
        ad_data: {
          title: '투자 추천',
          description: '포트폴리오 최적화를 위한 추천입니다.',
          action: 'portfolio_optimization'
        }
      })}\n\n`);
    } else if (userMessage.includes('테이블') || userMessage.includes('table')) {
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`
        }],
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
        ],
        ad_data: {
          title: '수익률 분석',
          description: '상세한 수익률 분석 리포트를 제공합니다.',
          action: 'profit_analysis'
        }
      })}\n\n`);
    } else if (userMessage.includes('이체') || userMessage.includes('transfer')) {
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 이체가 정상적으로 완료되었습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 이체가 정상적으로 완료되었습니다.`
        }],
        sub_data: [
          {
            type: 'transferInfo',
            data: {
              withdraw_account: '신한은행 110-123-456789',
              deposit_account: '신한은행 110-987-654321',
              transfer_amount: '1,000,000',
              transfer_cycle: '1회',
              transfer_period: '2024.12.20',
              receiver_memo: '월세',
              my_memo: '12월 월세',
              action: {
                label: '확인',
                action: 'transfer_confirm'
              }
            }
          }
        ],
        ad_data: {
          title: '이체 완료',
          description: '정상적으로 처리되었습니다.',
          action: 'transfer_complete'
        }
      })}\n\n`);
    } else if (userMessage.includes('계좌') || userMessage.includes('account')) {
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 고객님의 계좌 정보를 확인해드리겠습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 고객님의 계좌 정보를 확인해드리겠습니다.`
        }],
        sub_data: [
          {
            type: 'account_card',
            data: [
              {
                account_name: '신한은행',
                account_number: '110-123-456789',
                account_type: '입출금',
                balance: '2,500,000',
                currency: 'KRW',
                status: '정상',
                action: {
                  label: '상세보기',
                  action: 'account_detail'
                }
              },
              {
                account_name: '신한은행',
                account_number: '110-987-654321',
                account_type: '적금',
                balance: '5,000,000',
                currency: 'KRW',
                status: '정상',
                action: {
                  label: '상세보기',
                  action: 'account_detail'
                }
              },
              {
                account_name: '신한증권',
                account_number: '123-456-789',
                account_type: '증권',
                balance: '15,000,000',
                currency: 'KRW',
                status: '정상',
                action: {
                  label: '상세보기',
                  action: 'account_detail'
                }
              }
            ]
          }
        ],
        ad_data: {
          title: '계좌 관리',
          description: '계좌 정보를 한눈에 확인하세요.',
          action: 'account_management'
        }
      })}\n\n`);
    } else {
      // 일반 텍스트 응답
      res.write(`data: ${JSON.stringify({
        type: 'answer',
        main_answer: [{ 
          text: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`,
          voice: `"${userMessage}"에 대한 답변입니다. 이 답변은 실시간으로 스트리밍되고 있습니다.`
        }]
      })}\n\n`);
    }

    // 4. 스트림 완료
    await new Promise(resolve => setTimeout(resolve, 500));
    res.write('data: [DONE]\n\n');
    res.end();
    
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
  console.log('- "계좌" 또는 "account": 계좌 카드 컴포넌트 응답');
  console.log('- "이체" 또는 "transfer": 이체 정보 컴포넌트 응답');
  console.log('- 기타: 텍스트 응답만');
}); 