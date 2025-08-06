// API 설정 파일
// 로컬 설정이 있으면 우선 사용, 없으면 환경별 기본 설정 사용

// 로컬 설정 파일 import 시도 (없으면 에러 무시)
let LOCAL_CONFIG = null;
try {
  const localConfig = require('./api.local.js');
  LOCAL_CONFIG = localConfig;
} catch (error) {
  // 로컬 설정 파일이 없으면 기본 설정 사용
  console.log('로컬 설정 파일이 없습니다. 기본 설정을 사용합니다.');
}

const API_CONFIG = {
  // 개발 환경
  development: {
    baseURL: 'http://localhost:3002',
    chatEndpoint: '/api/chat/front'
  },
  
  // 운영 환경
  production: {
    baseURL: 'http://20.249.136.139',
    chatEndpoint: '/api/chat/front'
  }
};

// 현재 환경 감지
const isDevelopment = process.env.NODE_ENV === 'development';

// 로컬 설정이 있으면 우선 사용, 없으면 환경별 설정 사용
const currentConfig = LOCAL_CONFIG 
  ? { baseURL: LOCAL_CONFIG.LOCAL_API_CONFIG.baseURL, chatEndpoint: LOCAL_CONFIG.LOCAL_API_CONFIG.chatEndpoint }
  : (isDevelopment ? API_CONFIG.development : API_CONFIG.production);

// API URL 생성 함수
export const getChatAPIUrl = () => {
  return `${currentConfig.baseURL}${currentConfig.chatEndpoint}`;
};

// 환경 정보
export const getEnvironment = () => {
  if (LOCAL_CONFIG) return 'local';
  return isDevelopment ? 'development' : 'production';
};

export default API_CONFIG; 