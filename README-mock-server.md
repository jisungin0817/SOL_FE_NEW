# Mock API 서버 사용법

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install express cors
```

### 2. Mock 서버 실행
```bash
node mock-server.js
```

### 3. React 앱 실행 (별도 터미널)
```bash
npm start
```

## 테스트 방법

### 1. 기본 텍스트 응답
- 아무 메시지나 입력하면 텍스트 응답만 받습니다.

### 2. 카드 컴포넌트 응답
- 메시지에 "카드" 또는 "card" 포함
- 예: "카드 보여줘", "card component"

### 3. 그래프 컴포넌트 응답
- 메시지에 "그래프" 또는 "chart" 포함
- 예: "그래프 그려줘", "chart data"

### 4. 테이블 컴포넌트 응답
- 메시지에 "테이블" 또는 "table" 포함
- 예: "테이블 만들어줘", "table data"

## 응답 시퀀스

1. **0.5초**: 로딩 응답 (`sub_data: { type: 'loading' }`)
2. **2.5초**: 텍스트 응답 (`main_answer: [{ text: '...' }]`)
3. **4초**: 컴포넌트 응답 (키워드에 따라)
4. **5초**: 스트림 완료

## 실제 백엔드 연동 시

ChatPage.jsx에서 URL만 변경하면 됩니다:

```javascript
// Mock 서버 (개발용)
const response = await fetch('http://localhost:3001/api/v1/chat/completions', {

// 실제 백엔드 (운영용)
const response = await fetch('https://your-backend-server.com/api/v1/chat/completions', {
``` 