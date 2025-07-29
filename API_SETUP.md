# LLM 백엔드 API 설정 가이드

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
# API 설정
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_USE_MOCK_API=true
REACT_APP_USE_STREAMING=false

# 개발 환경 설정
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

## 환경변수 설명

### `REACT_APP_API_BASE_URL`
- LLM 백엔드 서버의 기본 URL
- 기본값: `http://localhost:8080`

### `REACT_APP_USE_MOCK_API`
- 목데이터 사용 여부
- `true`: 목데이터 사용 (백엔드 개발 전)
- `false`: 실제 API 호출 (백엔드 개발 완료 후)
- 기본값: `true`

### `REACT_APP_USE_STREAMING`
- 스트리밍 API 사용 여부
- `true`: Server-Sent Events (SSE) 사용
- `false`: 일반 HTTP 요청 사용
- 기본값: `false`

## API 엔드포인트

### 1. 채팅 API (일반)
```
POST /api/chat
```

**요청 본문:**
```json
{
  "message": "사용자 메시지",
  "context": {
    "sessionId": "세션 ID",
    "previousMessages": []
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**응답:**
```json
{
  "bot_msg_list": [
    {
      "main_answer": [
        {
          "text": "환전이 완료되었어요.",
          "voice": "환전이 완료되었어요."
        },
        {
          "text": "환전 완료!",
          "voice": "환전 완료!"
        }
      ],
      "sub_data": [
        {
          "type": "account_info",
          "data": [
            {
              "account_title": "입금된 계좌",
              "account_name": "신한 주거래 입출금 통장",
              "account_no": "180-100-100000",
              "account_amt": "30,000",
              "account_amt_type": "JPY",
              "account_amt_type_nm": "엔"
            }
          ]
        },
        {
          "type": "button_l_one",
          "data": [
            {
              "text": "환전하기",
              "action": {
                "type": "sendMsg",
                "next_bot_msg": {
                  "scnrCd": "NSAH24P-TEST-02",
                  "msg": "",
                  "visiable": false
                }
              }
            }
          ]
        }
      ],
      "ad_data": {},
      "speaker": "chatbot",
      "type": "answer"
    }
  ]
}
```

### 2. 채팅 API (스트리밍)
```
GET /api/chat/stream?message=사용자메시지
```

**Server-Sent Events 응답:**
```
data: {"speaker": "bot", "type": "loading", ...}

data: {"speaker": "bot", "type": "answer", ...}

event: complete
data: {}
```

### 3. 헬스 체크 API
```
GET /api/health
```

## 컴포넌트 타입 가이드

LLM이 생성해야 하는 컴포넌트 타입들:

| 타입 | 컴포넌트 | 설명 |
|------|----------|------|
| `between_card` | BetweenCard | 선택형 카드 |
| `button_l_one` | CustomButton | 단일 버튼 |
| `button_l_two` | CustomButtonTwo | 다중 버튼 |
| `chart_card` | ChartCard | 차트 카드 |
| `map` | MapCard | 지도 카드 |
| `bank_product` | BankProduct | 은행 상품 |
| `securities_product` | SecuritiesProduct | 증권 상품 |
| `annuity_card` | AnnuityCard | 연금 상품 |
| `bond_card` | BondCard | 채권 상품 |
| `savings_card` | SavingsCard | 적금 상품 |
| `account_info` | BankAccountCard | 계좌 정보 |
| `maturity` | MaturitySummaryCard | 만기 요약 |
| `exchange_menu` | ExchangeMenu | 환전 메뉴 |
| `input_amt` | ExchangeInput | 금액 입력 |
| `loan_product_card` | LoanProductCard | 대출 상품 |
| `loan_limit_card` | LoanLimitCard | 대출 한도 |
| `loan_estimate_card` | LoanEstimateCard | 대출 견적 |
| `eclipse_button` | ButtonGroup | 버튼 그룹 |

## 에러 처리

API 에러는 자동으로 사용자 친화적인 메시지로 변환됩니다:

- **네트워크 에러**: "네트워크 연결을 확인해주세요."
- **타임아웃 에러**: "요청 시간이 초과되었습니다. 다시 시도해주세요."
- **서버 에러**: "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
- **클라이언트 에러**: "잘못된 요청입니다."

## 개발 모드

개발 중에는 `REACT_APP_USE_MOCK_API=true`로 설정하여 목데이터를 사용하세요.
백엔드 개발이 완료되면 `REACT_APP_USE_MOCK_API=false`로 변경하여 실제 API를 사용하세요.

## AI 백엔드 호환성 가이드

### 시나리오 상태 관리
- 프론트엔드는 `transferStep` 등의 상태를 통해 현재 진행 중인 시나리오를 추적
- AI 백엔드는 **컨텍스트 기반**으로 사용자 의도를 파악하여 적절한 응답 제공
- 키워드 매칭이 아닌 **의도 인식**을 통해 시나리오 진행

### 예시 시나리오 플로우
1. **사용자**: "이체하고 싶어요"
2. **AI**: 계좌 선택 컴포넌트 제공
3. **사용자**: "신한 주거래 통장" (계좌명 클릭 또는 텍스트 입력)
4. **AI**: 금액 입력 컴포넌트 제공
5. **사용자**: "500만원"
6. **AI**: 받는 계좌 입력 컴포넌트 제공

### AI 백엔드 구현 시 고려사항
- 사용자의 **의도 파악** (이체, 환전, 대출 등)
- **컨텍스트 유지** (이전 대화 내용 기반)
- **단계별 진행** (시나리오의 현재 단계 인식)
- **컴포넌트 선택** (적절한 UI 컴포넌트 제공)

## 테스트

컴포넌트 테스트 화면에서 각 컴포넌트의 렌더링을 확인할 수 있습니다:
`http://localhost:3001/app2/component-test` 