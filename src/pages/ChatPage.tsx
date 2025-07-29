import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chatTypes';
import ChatRenderer from '../components/ChatRenderer';
import styles from './ChatPage.module.css';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      speaker: 'user',
      type: 'user_message',
      main_answer: [{ text: inputValue }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 로딩 메시지 추가
    const loadingMessage: ChatMessage = {
      speaker: 'chatbot',
      type: 'loading'
    };
    setMessages(prev => [...prev, loadingMessage]);

    // 실제 AI 응답을 시뮬레이션 (나중에 실제 API로 교체)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        speaker: 'chatbot',
        type: 'answer',
        main_answer: [{ text: `"${inputValue}"에 대한 답변입니다.` }],
        sub_data: [
          {
            type: 'buttons',
            data: [
              { text: '더 자세히', action: 'detail' },
              { text: '다른 질문', action: 'new_question' }
            ]
          }
        ]
      };

      setMessages(prev => prev.filter(msg => msg.type !== 'loading').concat(botMessage));
      setIsLoading(false);
    }, 2000);
  };

  const handleAction = (action: string, value?: any) => {
    console.log('Action triggered:', action, value);
    // 액션 처리 로직
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatHeader}>
        <h1>AI 채팅</h1>
      </div>
      
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <h2>안녕하세요!</h2>
              <p>무엇을 도와드릴까요?</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatRenderer
                key={index}
                message={message}
                onAction={handleAction}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={styles.textInput}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={styles.sendButton}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 