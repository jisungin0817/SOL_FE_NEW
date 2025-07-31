import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import ChatListNew from '../components/chat/ChatListNew';
import ChatInput from '../components/chat/ChatInput';
import { getSpeech } from '../utils/getSpeech';
import { initStopwatchRef, resetClock, startClock } from '../utils/Stopwatch';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './ChatPage.module.css';
import welcomeLogo from '../assets/images/welcome_logo.png';

const ChatPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [chatListData, setChatListData] = useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const isMsgLoadingRef = useRef(false);
  const isMsgTextingRef = useRef(false);
  const chatListDataRef = useRef([]);
  const userInputRef = useRef();
  const [mic, setMic] = useState(false);
  const [sttTimer, setSttTimer] = useState("00:00");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const scrollToBottom = () => {
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

    const sendMsgToBotByComponent = async (data) => {
    console.log('[sendMsgToBotByComponent] 호출:', data);

    if (data.msg === "") {
      console.log('[sendMsgToBotByComponent] 빈 메시지');
      return;
    }

    // 새로운 대화 시작 - 이전 대화 초기화
    const userMsg = {
      speaker: 'user',
      type: 'user_message',
      main_answer: [{ text: data.msg }]
    };

    setChatListData([userMsg]);
    chatListDataRef.current = [userMsg];
    
    setTimeout(scrollToBottom, 100);

    try {
      // SSE API 호출 (webpack 프록시를 통해)
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify({
          "model": "/home/work/llm/qwen3-30b",
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful assistant."
            },
            {
              "role": "user",
              "content": data.msg
            }
          ],
          "max_tokens": 1024,
          "temperature": 0.7,
          "top_p": 1.0,
          "n": 1,
          "stream": true,
          "stop": null
        })
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      // SSE 스트림 처리
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            console.log('SSE 데이터 수신:', data); // 디버깅용 로그
            
            if (data === '[DONE]') {
              // 스트림 완료
              console.log('SSE 스트림 완료');
              
              // 스트림 완료 - 누적된 텍스트 유지
              console.log('스트림 완료 - 누적된 텍스트 유지');
              
              setIsMsgLoading(false);
              isMsgLoadingRef.current = false;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              console.log('파싱된 SSE 데이터:', parsed); // 디버깅용 로그
              
              // 백엔드에서 오는 메시지 타입에 따라 처리
              if (parsed.type === 'loading') {
                // 로딩 메시지 추가
                const loadingMsg = {
                  speaker: 'chatbot',
                  type: 'loading'
                };
                setChatListData(prev => [...prev, loadingMsg]);
                chatListDataRef.current = [...chatListDataRef.current, loadingMsg];
                setIsMsgLoading(true);
                isMsgLoadingRef.current = true;
              } else if (parsed.type === 'answer' && parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                // 기존 JSON 포맷 답변 메시지 처리
                const content = parsed.choices[0].delta.content;
                console.log('기존 포맷 답변 내용:', content);
              } else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                // OpenAI 형식 응답 처리 (테스트용) - append 방식
                const content = parsed.choices[0].delta.content;
                console.log('OpenAI 포맷 답변 내용:', content);
                
                // 로딩 상태 유지 (스트림 진행 중)
                setIsMsgLoading(true);
                isMsgLoadingRef.current = true;
                
                // append 방식으로 누적
                setChatListData(prev => {
                  const newData = [...prev];
                  let lastMsg = newData[newData.length - 1];
                  
                  // 마지막 메시지가 answer 타입이 아니면 새로 생성
                  if (!lastMsg || lastMsg.type !== 'answer') {
                    lastMsg = {
                      speaker: 'chatbot',
                      type: 'answer',
                      main_answer: [{ text: content }]
                    };
                    newData.push(lastMsg);
                  } else {
                    // 기존 답변에 텍스트 추가 (append)
                    lastMsg.main_answer[0].text += content;
                  }
                  
                  return newData;
                });
                
                setTimeout(scrollToBottom, 50);
              }
            } catch (e) {
              console.log('SSE 데이터 파싱 에러:', e);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('SSE API 통신 에러:', error);
      
      // CORS 에러인지 확인
      let errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        errorMessage = '서버 연결에 문제가 있습니다. 네트워크 연결을 확인해주세요.';
      } else if (error.message.includes('timeout')) {
        errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      }
      
      // 에러 메시지 표시
      const errorMsg = {
        speaker: 'chatbot',
        type: 'answer',
        main_answer: [{ text: errorMessage }]
      };
      
      // 새로운 대화 시작 - 사용자 메시지와 에러 메시지만 유지
      setChatListData([userMsg, errorMsg]);
      chatListDataRef.current = [userMsg, errorMsg];
    } finally {
      setIsMsgLoading(false);
      isMsgLoadingRef.current = false;
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSendButtonClick = async () => {
    const userInput = userInputRef.current?.value;
    if (!userInput || !userInput.trim()) return;

    await sendMsgToBotByComponent({ msg: userInput.trim() });
    if (userInputRef.current && userInputRef.current.value !== undefined) {
      userInputRef.current.value = '';
    }
  };

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('브라우저가 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setMic(false);
      resetClock();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
      setMic(true);
      startClock();
    }
  };

  const handleMicReset = () => {
    resetTranscript();
    setMic(false);
    resetClock();
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (transcript && !listening) {
      if (userInputRef.current && userInputRef.current.value !== undefined) {
        userInputRef.current.value = transcript;
      }
      handleMicReset();
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (chatListData.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatListData]);

  // 웰컴메시지 상태 관리
  useEffect(() => {
    setShowWelcomeMessage(true);
  }, []);

  const handleCloseChat = () => {
    setShowWelcomeMessage(false);
    navigate('/');
  };

  return (
    <div className={`${styles.chatPage} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* 웰컴메시지 */}
      {showWelcomeMessage && chatListData.length === 0 && (
        <div className={styles.welcomeMessage}>
          <div className={styles.logoContainer}>
            <img src={welcomeLogo} alt="SOL AI Logo" className={styles.logo} />
          </div>
          <div className={styles.welcomeText}>
            <div className={styles.welcomeTitle}>궁금증을 풀어드릴</div>
            <div className={styles.welcomeSubtitle}>SOL AI에요</div>
          </div>
          <div className={styles.userGreeting}>
            <div className={styles.greetingText}>안녕하세요. 김신한님!</div>
            <div className={styles.helpText}>무엇을 도와드릴까요?</div>
          </div>
        </div>
      )}
      
      {chatListData.length > 0 && (
        <div className={styles.chatContainer}>
          {chatListData.map((item, index) => (
            <div key={index} className={styles.messageContainer}>
              {item.speaker === 'user' || item.type === 'user_message' ? (
                <div className={styles.userMessage}>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : item.msg || ""}
                </div>
              ) : item.type === 'answer' ? (
                <div className={styles.aiMessage}>
                  <div className={styles.searchingIcon}></div>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : ""}
                </div>
              ) : item.type === 'response' ? (
                <div className={styles.aiResponse}>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : ""}
                </div>
              ) : (
                <div className={styles.aiMessage}>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
              <ChatInput
          onSendButtonClick={handleSendButtonClick}
          isLoading={isMsgLoading}
          userInputRef={userInputRef}
          mic={mic}
          handleMicClick={handleMicClick}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          sttTimer={sttTimer}
          isChatOpen={true}
          onClose={handleCloseChat}
        />
    </div>
  );
};

export default ChatPage; 