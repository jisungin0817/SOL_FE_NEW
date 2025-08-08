# SuperSol POC Frontend

SuperSol 은행 AI 챗봇 인터페이스의 프론트엔드 애플리케이션입니다.

## 🚀 프로젝트 개요

이 프로젝트는 React 기반의 모던한 금융 AI 챗봇 인터페이스를 제공합니다. 사용자는 자연어로 은행 업무를 문의하고, AI가 텍스트 응답과 함께 다양한 금융 데이터 컴포넌트를 제공합니다.

## ✨ 주요 기능

### 🤖 AI 챗봇 인터페이스
- **실시간 스트리밍**: 서버 사이드 이벤트(SSE)를 통한 실시간 응답
- **음성 인식**: 브라우저 내장 음성 인식 기능
- **세션 관리**: 자동 세션 ID 생성으로 대화 컨텍스트 유지
- **페르소나 선택**: 다양한 AI 페르소나 지원

### 📊 동적 컴포넌트 시스템
- **계좌 카드**: 잔고 및 계좌 정보 표시
- **이체 내역**: 거래 히스토리 테이블
- **차트/그래프**: 수익률 및 포트폴리오 시각화
- **자동이체 정보**: 정기 결제 관리
- **ETF 테이블**: 투자 상품 비교표
- **이체 결과**: 거래 완료 정보

### 🎨 UI/UX 특징
- **다크 모드**: 자동 테마 감지 및 수동 토글
- **글래스모피즘**: 반투명 배경과 블러 효과
- **반응형 디자인**: 모바일/데스크톱 최적화
- **애니메이션**: 부드러운 슬라이드 및 페이드 효과

## 🛠 기술 스택

### Core
- **React 18** - 함수형 컴포넌트 + Hooks
- **React Router** - SPA 라우팅
- **CSS Modules** - 스타일 캡슐화

### 개발 도구
- **Webpack** - 번들링 및 개발 서버
- **Babel** - ES6+ 트랜스파일링

### 외부 라이브러리
- **react-speech-recognition** - 음성 인식
- **react-icons** - 아이콘 라이브러리
- **lottie-react** - 애니메이션

## 📁 프로젝트 구조

```
frontendNew/
├── public/                          # 정적 파일
│   ├── index.html                  # HTML 템플릿
│   ├── fonts/                      # Pretendard 폰트 파일
│   └── *.svg, *.png               # 아이콘 및 이미지
├── src/
│   ├── components/                 # 재사용 가능한 컴포넌트
│   │   ├── main/                  # 메인 답변 컴포넌트
│   │   │   ├── MainAnswer.jsx     # AI 답변 텍스트 표시
│   │   │   └── MainAnswer.module.css
│   │   ├── sub/                   # 서브 데이터 컴포넌트 (8가지)
│   │   │   ├── SubAccountCard.jsx          # 계좌 정보 카드
│   │   │   ├── SubChart.jsx               # 수익률 차트
│   │   │   ├── SubGraph.jsx               # 포트폴리오 그래프
│   │   │   ├── SubTableContainer.jsx      # ETF 테이블
│   │   │   ├── SubTransferHistory.jsx     # 이체 내역
│   │   │   ├── SubAutoTransferInfo.jsx    # 자동이체 정보
│   │   │   ├── SubTransferResult.jsx      # 이체 결과
│   │   │   ├── SubButtons.jsx             # 액션 버튼
│   │   │   ├── SubChat.jsx                # 채팅 컴포넌트
│   │   │   └── SubDataRenderer.jsx        # 컴포넌트 라우터
│   │   ├── PersonaSelector.jsx            # AI 페르소나 선택기
│   │   └── ThemeContext.js               # 다크모드 컨텍스트
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── chat/                  # 채팅 페이지
│   │   │   ├── ChatPage.jsx       # 메인 채팅 페이지
│   │   │   ├── ChatInput.jsx      # 사용자 입력 컴포넌트
│   │   │   ├── ChatListNew.jsx    # 채팅 메시지 리스트
│   │   │   ├── AIChatBox.jsx      # AI 답변 박스
│   │   │   ├── UserChatBox.jsx    # 사용자 메시지 박스
│   │   │   └── css/               # 채팅 관련 CSS
│   │   ├── home/                  # 홈 페이지
│   │   │   ├── HomeNew.jsx        # 메인 홈 페이지
│   │   │   ├── CardSlider.jsx     # 카드 슬라이더
│   │   │   └── css/               # 홈 관련 CSS
│   │   └── SubComponentPreview.jsx # 컴포넌트 미리보기
│   ├── assets/                    # 정적 리소스
│   │   ├── icons/                 # SVG 아이콘 (30+ 개)
│   │   ├── images/                # 이미지 파일
│   │   └── lottie/                # 로띠 애니메이션
│   ├── config/                    # 설정 파일
│   │   ├── api.js                 # API 엔드포인트 설정
│   │   └── api.local.js           # 로컬 개발용 설정
│   ├── utils/                     # 유틸리티 함수
│   │   ├── getSpeech.js           # TTS 기능
│   │   ├── Stopwatch.js           # 타이머 유틸
│   │   ├── TypingEffect.js        # 타이핑 애니메이션
│   │   ├── Dictaphone.jsx         # 음성 인식
│   │   ├── LottieComponent.jsx    # 로띠 컴포넌트
│   │   └── blendColor.js          # 색상 유틸
│   ├── App.jsx                    # 루트 컴포넌트
│   ├── index.jsx                  # 앱 진입점
│   ├── App.css                    # 글로벌 스타일
│   └── index.css                  # 기본 스타일
├── package.json                   # 프로젝트 설정 및 의존성
├── webpack.config.js              # 개발용 웹팩 설정
├── webpack.config.prod.js         # 프로덕션용 웹팩 설정
└── README.md                      # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

## ⚙️ 환경 설정

### API 엔드포인트 설정
`src/config/api.js` 파일에서 백엔드 API URL을 설정할 수 있습니다:

```javascript
// 개발 환경
export const getChatAPIUrl = () => {
  return 'http://localhost:8000/api/v1/chat/completions';
};

// 프로덕션 환경
export const getChatAPIUrl = () => {
  return 'https://your-production-api.com/api/v1/chat/completions';
};
```

## 📊 컴포넌트 미리보기

`/preview` 경로에서 모든 서브 컴포넌트를 미리볼 수 있습니다:

- **Graph**: 포트폴리오 구성 차트
- **Account Card**: 계좌 정보 카드
- **Chart**: 수익률 예상 차트
- **Transfer History**: 이체 내역 테이블
- **Auto Transfer Info**: 자동이체 정보
- **Transfer Result**: 이체 결과
- **Table Container**: ETF 정보 테이블

## 🔧 개발 가이드

### 새로운 서브 컴포넌트 추가

1. **컴포넌트 생성**
   ```jsx
   // src/components/sub/SubNewComponent.jsx
   const SubNewComponent = ({ data, onAction }) => {
     return <div>{/* 컴포넌트 내용 */}</div>;
   };
   ```

2. **DataRenderer에 등록**
   ```jsx
   // src/components/sub/SubDataRenderer.jsx
   case 'new_component':
     return <SubNewComponent key={index} data={item.data} onAction={onAction} />;
   ```

3. **미리보기에 추가**
   ```jsx
   // src/pages/SubComponentPreview.jsx
   new_component: {
     sub_data: [{ type: 'new_component', data: {...} }]
   }
   ```

### 세션 관리

채팅 세션은 `localStorage`를 통해 자동 관리됩니다:
- 페이지 로드 시 새로운 세션 ID 생성
- 같은 세션 내에서 대화 컨텍스트 유지
- 브라우저 종료 시 세션 초기화

## 🎨 스타일 가이드

### CSS Modules 사용
```jsx
import styles from './Component.module.css';

const Component = () => {
  return <div className={styles.container}>...</div>;
};
```

### 테마 시스템
```jsx
import { useTheme } from '../components/ThemeContext';

const Component = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return <div className={isDarkMode ? 'dark' : 'light'}>...</div>;
};
```

## 📱 반응형 디자인

모든 컴포넌트는 다음 브레이크포인트를 지원합니다:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔄 API 연동 및 JSON 데이터 형식

### 요청 형식
```javascript
{
  "user_id": "1",                    // 사용자 ID (페르소나 선택 시 변경)
  "chat_id": "session_1234567890",   // 세션 ID (자동 생성)
  "text": "사용자 메시지"              // 사용자 입력 텍스트
}
```

### 기본 응답 형식
```javascript
{
  "bot_msg_list": [{
    "type": "loading|answer",          // 응답 타입
    "main_answer": [{                  // AI 텍스트 응답
      "text": "AI 응답 텍스트",
      "voice": ""                      // TTS용 텍스트 (선택적)
    }],
    "sub_data": [...],                 // 서브 컴포넌트 데이터 배열
    "ad_data": {                       // 광고/부가 정보 (선택적)
      "text": "HTML 형식 텍스트"
    }
  }]
}
```

## 📊 서브 컴포넌트 JSON 형식

### 1. 계좌 카드 (account_card)
```javascript
{
  "type": "account_card",
  "data": [
    {
      "account_name": "홍길동 자유적금",
      "account_number": "11012345678901",
      "balance": 5000000               // 잔액 (숫자)
    }
  ]
}
```

### 2. 이체 내역 (transfer_history)
```javascript
{
  "type": "transfer_history",
  "data": [
    {
      "transfer_date": "20250720",     // YYYYMMDD 형식
      "input_account_name": "김영희",   // 입금자명
      "transfer_amt": 500000           // 이체금액
    }
  ]
}
```

### 3. 포트폴리오 그래프 (graph)
```javascript
{
  "type": "graph",
  "data": {
    "title": "포트폴리오 구성",
    "description": "펀드/ETF는 채권 비중을 높여 구성하는게 좋을 것 같아요.",
    "portfolio": {
      "fund": 80,                      // 펀드 비율 (%)
      "savings": 20,                   // 예적금 비율 (%)
      "fundLabel": "펀드/ETF",
      "savingsLabel": "예적금"
    }
  }
}
```

### 4. 수익률 차트 (chart)
```javascript
{
  "type": "chart",
  "data": {
    "chartTitle": "수익률 예상",
    "chartData": [12, 19, 3, 5, 2],   // 차트 데이터 배열
    "description": {
      "main": "해당 구성으로 수익률을 예상해보면,",
      "sub": "연 4.88%로 약 920만원의 이자가 예상돼요.",
      "note": "(시장상황에 따라 변동이 있을 수 있어요.)"
    }
  }
}
```

### 5. 자동이체 정보 (auto_transfer_info)
```javascript
{
  "type": "auto_transfer_info",
  "data": {
    "output_account": "11012345678900",    // 출금계좌
    "input_account": "30101234567890",     // 입금계좌
    "transfer_amt": 150000,                // 이체금액
    "transfer_date": "매월 20일",          // 이체일자
    "output_account_name": "홍길동",
    "input_account_name": "한국전력",
    "transfer_period": "2025-02-01 ~ 9999-12-31",
    "accept_memo": "전기요금",
    "transfer_memo": "자동납부"
  }
}
```

### 6. 이체 결과 (transfer_result)
```javascript
{
  "type": "transfer_result",
  "data": {
    "output_account": "11012345678901",    // 출금계좌
    "input_account": "11087654321098",     // 입금계좌
    "transfer_amt": 500000,                // 이체금액
    "transfer_period": 4500000             // 이체후잔액
  }
}
```

### 7. ETF 테이블 (table_container)
```javascript
{
  "type": "table_container",
  "data": [
    {
      "etf_name": "TIGER 고배당",
      "etf_return": "+4.8%",             // 수익률 (색상 자동 적용)
      "etf_volatility": "7.2%",          // 변동성
      "etf_total_return": "0.19%",       // 총보수 (선택적)
      "etf_news_keyword": "공급망/IRA"   // 뉴스키워드 (선택적)
    }
  ]
}
```

### 8. 액션 버튼 (buttons)
```javascript
{
  "type": "buttons",
  "data": [
    {
      "text": "계좌 조회",
      "action": "view_accounts",
      "style": "primary"                 // primary, secondary
    }
  ]
}
```

## 💡 데이터 처리 규칙

### 선택적 필드 처리
- **ETF 테이블**: `etf_total_return`, `etf_news_keyword`는 하나라도 값이 있으면 컬럼 표시
- **값이 없는 경우**: `-` 또는 빈 문자열로 표시

### 수익률 색상 처리
- **양수**: 초록색 (#00C851)
- **음수**: 빨간색 (#ff4444)
- **0 또는 비수치**: 기본 색상

### 금액 표시
- **숫자로 입력**: 1000000
- **화면 표시**: 1,000,000원 (자동 포맷팅)

### HTML 텍스트 지원
- **ad_data.text**: HTML 태그 지원 (`<br>`, `<strong>` 등)
- **main_answer.text**: HTML 태그 지원

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.
