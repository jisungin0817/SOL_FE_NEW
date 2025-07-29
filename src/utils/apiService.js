// AI 채팅 API 서비스
// API 설정
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    CHAT: '/api/chat',
    CHAT_STREAM: '/api/chat/stream',
    HEALTH: '/api/health'
  },
  TIMEOUT: 30000, // 30초
  RETRY_COUNT: 3
};

// HTTP 상태 코드
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// 에러 타입
const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// 커스텀 에러 클래스
class APIError extends Error {
  constructor(message, type, status, response) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.response = response;
  }
}

// API 응답 구조
const createAPIResponse = (data, success = true, message = '') => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString()
});

// 헤더 설정
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // 인증 토큰이 있다면 추가 (실제 구현 시)
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 타임아웃 설정
const createTimeoutPromise = (timeout) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new APIError('Request timeout', ERROR_TYPES.TIMEOUT, 408));
    }, timeout);
  });
};

// 기본 HTTP 요청 함수
const makeRequest = async (url, options = {}, timeout = API_CONFIG.TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal,
        headers: getHeaders()
      }),
      createTimeoutPromise(timeout)
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}`,
        response.status >= 500 ? ERROR_TYPES.SERVER : ERROR_TYPES.CLIENT,
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new APIError('Request aborted', ERROR_TYPES.TIMEOUT, 408);
    }
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error.message || 'Network error',
      ERROR_TYPES.NETWORK,
      0,
      error
    );
  }
};

// 재시도 로직
const retryRequest = async (requestFn, retryCount = API_CONFIG.RETRY_COUNT) => {
  let lastError;

  for (let i = 0; i <= retryCount; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // 재시도하지 않을 에러들
      if (error.status === 400 || error.status === 401 || error.status === 403) {
        break;
      }
      
      // 마지막 시도가 아니면 잠시 대기 후 재시도
      if (i < retryCount) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// AI 채팅 API (일반 요청)
export const sendChatMessage = async (message, context = {}) => {
  const payload = {
    message,
    context,
    timestamp: new Date().toISOString(),
    sessionId: localStorage.getItem('sessionId') || 'default-session'
  };

  try {
    // 실제 API 호출
    const response = await retryRequest(() =>
      makeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    );

    const data = await response.json();
    
    // API 응답 구조 처리
    if (data.data) {
      return createAPIResponse(data.data);
    } else {
      return createAPIResponse(data);
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};

// AI 채팅 API (스트리밍)
export const sendChatMessageStream = (message, context = {}, callbacks = {}) => {
  const { onMessage, onError, onComplete } = callbacks;

  try {
    // 실제 SSE 연결
    const eventSource = new EventSource(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}?message=${encodeURIComponent(message)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('SSE parsing error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      if (onError) onError(error);
      eventSource.close();
    };

    eventSource.addEventListener('complete', () => {
      if (onComplete) onComplete();
      eventSource.close();
    });

    return {
      close: () => eventSource.close()
    };
  } catch (error) {
    console.error('Stream API Error:', error);
    if (onError) onError(error);
    throw error;
  }
};

// 헬스 체크 API
export const checkAPIHealth = async () => {
  try {
    const response = await makeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET'
    }, 5000); // 헬스 체크는 5초 타임아웃

    const data = await response.json();
    return createAPIResponse(data, true, 'API is healthy');
  } catch (error) {
    console.error('Health check failed:', error);
    return createAPIResponse(null, false, 'API is unhealthy');
  }
};

// 에러 처리 유틸리티
export const handleAPIError = (error) => {
  console.error('API Error:', error);

  switch (error.type) {
    case ERROR_TYPES.NETWORK:
      return '네트워크 연결을 확인해주세요.';
    case ERROR_TYPES.TIMEOUT:
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    case ERROR_TYPES.SERVER:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case ERROR_TYPES.CLIENT:
      return error.message || '잘못된 요청입니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

// API 설정 업데이트
export const updateAPIConfig = (newConfig) => {
  Object.assign(API_CONFIG, newConfig);
};

// 현재 API 설정 반환
export const getAPIConfig = () => ({ ...API_CONFIG }); 