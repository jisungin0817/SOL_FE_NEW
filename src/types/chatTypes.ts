// 채팅 메시지 기본 타입
export interface ChatMessage {
  speaker: 'user' | 'chatbot';
  type: 'user_message' | 'answer' | 'loading';
  main_answer?: MainAnswerItem[];
  sub_data?: SubDataType[];
  ad_data?: any;
}

// 메인 답변 아이템 타입
export interface MainAnswerItem {
  text: string;
  voice?: string;
}

// 서브 데이터 타입 (유니온 타입으로 확장 가능)
export type SubDataType = 
  | SubMapData
  | SubButtonData
  | SubChartData
  | SubCardData;

// 지도 데이터 타입
export interface SubMapData {
  type: 'map';
  data: {
    location?: string;
    coordinates?: [number, number];
    markers?: Array<{
      position: [number, number];
      title: string;
    }>;
  };
}

// 버튼 데이터 타입
export interface SubButtonData {
  type: 'buttons';
  data: Array<{
    text: string;
    action?: string;
    value?: any;
  }>;
}

// 차트 데이터 타입
export interface SubChartData {
  type: 'chart';
  data: {
    chartType: 'bar' | 'line' | 'pie';
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
    }>;
  };
}

// 카드 데이터 타입
export interface SubCardData {
  type: 'card';
  data: {
    title: string;
    content: string;
    image?: string;
    actions?: Array<{
      text: string;
      action: string;
    }>;
  };
}

// 채팅 컴포넌트 Props 타입
export interface ChatRendererProps {
  message: ChatMessage;
  onAction?: (action: string, value?: any) => void;
}

export interface MainAnswerProps {
  items: MainAnswerItem[];
}

export interface SubDataRendererProps {
  data: SubDataType[];
  onAction?: (action: string, value?: any) => void;
} 