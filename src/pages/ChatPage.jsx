import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
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

    flushSync(() => {
    setChatListData([userMsg]);
    chatListDataRef.current = [userMsg];
    });
    
    setTimeout(scrollToBottom, 100);

    try {
      // 백엔드 API 통신
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: data.msg
            }
          ],
          stream: true,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasLoadingStarted = false;
      let hasComponentResponse = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              console.log('스트림 완료');
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              // sub_data가 loading이면 "찾는중..." 표시
              if (parsed.sub_data && parsed.sub_data.type === 'loading' && !hasLoadingStarted) {
                hasLoadingStarted = true;
                const loadingMsg = {
                  speaker: 'chatbot',
                  type: 'loading',
                  sub_data: parsed.sub_data
                };
                flushSync(() => {
                  setChatListData(prev => [...prev, loadingMsg]);
                  chatListDataRef.current = [...chatListDataRef.current, loadingMsg];
                  setIsMsgLoading(true);
                  isMsgLoadingRef.current = true;
                });
              }
              
              // main_answer가 있으면 "찾는중..." 밑에 흰색 텍스트로 표시
              if (parsed.main_answer && parsed.main_answer.length > 0) {
                const textMsg = {
                  speaker: 'chatbot',
                  type: 'text_response',
                  main_answer: parsed.main_answer
                };
                
                flushSync(() => {
                  setChatListData(prev => [...prev, textMsg]);
                  chatListDataRef.current = [...chatListDataRef.current, textMsg];
                });
              }
              
              // sub_data에 컴포넌트가 있으면 다음 턴으로 넘어가기
              if (parsed.sub_data && Array.isArray(parsed.sub_data) && parsed.sub_data.length > 0 && !hasComponentResponse) {
                hasComponentResponse = true;
                
                // 현재 로딩 상태 해제
                flushSync(() => {
                  setIsMsgLoading(false);
                  isMsgLoadingRef.current = false;
                });
                
                // 다음 턴으로 넘어가기 위해 새로운 대화 시작
                const componentMsg = {
                  speaker: 'chatbot',
                  type: 'response',
                  main_type: 'component',
                  main_answer: [],
                  sub_data: parsed.sub_data
                };
                
                flushSync(() => {
                  setChatListData(prev => [...prev, componentMsg]);
                  chatListDataRef.current = [...chatListDataRef.current, componentMsg];
                });
              }
              
            } catch (e) {
              console.error('JSON 파싱 에러:', e);
            }
          }
        }
      }
      
      // API 통신 완료 후에도 로딩 상태가 남아있으면 해제
      if (isMsgLoadingRef.current) {
        flushSync(() => {
          setIsMsgLoading(false);
          isMsgLoadingRef.current = false;
        });
      }
    } catch (error) {
      console.error('API 통신 에러:', error);
      
      // 에러 메시지 표시
      const errorMsg = {
        speaker: 'chatbot',
        type: 'response',
        main_type: 'text',
        main_answer: [{ text: '죄송합니다. 일시적인 오류가 발생했습니다.' }]
      };
      
      flushSync(() => {
        setChatListData(prev => [...prev, errorMsg]);
        chatListDataRef.current = [...chatListDataRef.current, errorMsg];
        setIsMsgLoading(false);
        isMsgLoadingRef.current = false;
      });
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
              ) : item.type === 'loading' ? (
                <div className={styles.aiMessage}>
                  <div className={styles.searchingIcon}></div>
                  찾는중...
                </div>
              ) : item.type === 'text_response' ? (
                <div style={{
                  color: 'white',
                  fontSize: '16px',
                  paddingLeft: '10px',
                  marginTop: '-5px',
                  marginBottom: '10px'
                }}>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : ""}
                </div>
              ) : item.type === 'response' ? (
                <div style={{
                  color: 'white',
                  fontSize: '16px',
                  paddingLeft: '10px',
                  marginTop: '-5px',
                  marginBottom: '10px'
                }}>
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