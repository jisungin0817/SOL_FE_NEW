import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemeContext';
import ChatListNew from './ChatListNew';
import ChatInput from './ChatInput';
import SubDataRenderer from '../../components/sub/SubDataRenderer';
import { getSpeech } from '../../utils/getSpeech';
import { initStopwatchRef, resetClock, startClock } from '../../utils/Stopwatch';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './ChatPage.module.css';
import welcomeLogo from '../../assets/images/welcome_logo.png';

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
      // 강제로 스크롤을 맨 아래로
      chatContainer.scrollTop = chatContainer.scrollHeight;
      
      // 추가로 한 번 더 확실하게
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
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
    setChatListData([userMsg]); // 이전 대화 초기화하고 새 메시지만 추가
    chatListDataRef.current = [userMsg];
    setShowWelcomeMessage(false); // 대화 시작 시 웰컴 메시지 완전히 숨김
    });
    
    setTimeout(scrollToBottom, 100);

    try {
      // 백엔드 API 통신 (Mock 서버 사용)
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
               
               // loading_text가 있으면 loading 메시지 업데이트 (스트리밍 효과)
               if (parsed.sub_data && parsed.sub_data.type === 'loading' && parsed.sub_data.loading_text) {
                 flushSync(() => {
                   setChatListData(prev => {
                     const newList = [...prev];
                     const lastIndex = newList.length - 1;
                     
                     // 마지막 메시지가 loading 타입이면 loading_text 업데이트
                     if (lastIndex >= 0 && newList[lastIndex].type === 'loading') {
                       newList[lastIndex] = {
                         ...newList[lastIndex],
                         sub_data: {
                           ...newList[lastIndex].sub_data,
                           loading_text: parsed.sub_data.loading_text
                         }
                       };
                     }
                     
                     chatListDataRef.current = newList;
                     return newList;
                   });
                 });
               }
              
                             // main_answer가 있으면 loading 메시지에 바로 업데이트 (스트리밍 효과)
               if (parsed.main_answer && parsed.main_answer.length > 0 && !hasComponentResponse) {
                 flushSync(() => {
                   setChatListData(prev => {
                     const newList = [...prev];
                     const lastIndex = newList.length - 1;
                     
                     // 마지막 메시지가 loading 타입이면 main_answer 추가 (실시간 스트리밍)
                     if (lastIndex >= 0 && newList[lastIndex].type === 'loading') {
                       newList[lastIndex] = {
                         ...newList[lastIndex],
                         main_answer: parsed.main_answer
                       };
                     }
                     
                     chatListDataRef.current = newList;
                     return newList;
                   });
                 });
               }
              
              // 통합 응답 처리 (main_answer + sub_data + ad_data) - 새로운 대화로 시작
              if (parsed.type === 'answer' && (parsed.main_answer || parsed.sub_data || parsed.ad_data)) {
                hasComponentResponse = true;
                
                // 현재 로딩 상태 해제
                flushSync(() => {
                  setIsMsgLoading(false);
                  isMsgLoadingRef.current = false;
                });
                
                // 새로운 대화로 시작 (이전 대화 초기화)
                const answerMsg = {
                  speaker: 'chatbot',
                  type: 'answer',
                  main_answer: parsed.main_answer || [],
                  sub_data: parsed.sub_data || [],
                  ad_data: parsed.ad_data || null
                };
                
                flushSync(() => {
                  setChatListData([answerMsg]); // 새로운 대화로 시작
                  chatListDataRef.current = [answerMsg];
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
      // 새 메시지가 추가될 때마다 부드럽게 스크롤
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
      {/* 메인 콘텐츠 영역 */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 120px)', /* ChatInput 높이만큼 제외 */
        overflow: 'hidden',
        paddingTop: '20px' /* 상단 여백 추가 */
      }}>
        {/* 웰컴메시지 - 대화가 없을 때만 표시 */}
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
        
        {/* 채팅 컨테이너 - 대화가 있을 때 표시 */}
        {chatListData.length > 0 && (
        <div className={styles.chatContainer}>
          {chatListData.map((item, index) => (
            <div key={index} className={styles.messageContainer}>
              {item.speaker === 'user' || item.type === 'user_message' ? (
                <div className={styles.userMessage}>
                  {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : item.msg || ""}
                </div>
                             ) : item.type === 'loading' ? (
                 <div>
                   {/* 말풍선 - "찾는중..." (스트리밍 효과) */}
                   <div className={`${styles.aiMessage} ${styles.expanding}`}>
                     <div className={styles.searchingIcon}></div>
                     {item.sub_data && item.sub_data.loading_text ? item.sub_data.loading_text : "찾는중..."}
                   </div>
                   {/* main_answer 텍스트 - 말풍선 밑에 흰색으로 (스트리밍 효과) */}
                   {item.main_answer && item.main_answer.length > 0 && (
                     <div style={{
                       color: 'white',
                       fontSize: '16px',
                       paddingLeft: '10px',
                       marginTop: '10px',
                       marginBottom: '10px'
                     }}>
                       {item.main_answer.map((answer, idx) => (
                         <div key={idx}>
                           {answer.text}
                           {/* TTS 기능은 유지하되 아이콘은 숨김 */}
                           {answer.voice && (
                             <button 
                               onClick={() => {
                                 // TTS 재생 로직
                                 console.log('TTS 재생:', answer.voice);
                               }}
                               style={{
                                 display: 'none' // TTS 아이콘 숨김
                               }}
                             >
                               🔊
                             </button>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
              
                             ) : item.type === 'answer' ? (
                 <div>
                   {/* 말풍선 - 축소되는 말풍선 */}
                   <div className={`${styles.aiMessage} ${styles.collapsing}`}>
                     <div className={styles.searchingIcon}></div>
                   </div>
                   {/* main_answer 텍스트 - 말풍선 밑에 흰색으로 */}
                   {item.main_answer && item.main_answer.length > 0 && (
                     <div style={{
                       color: 'white',
                       fontSize: '16px',
                       paddingLeft: '10px',
                       marginTop: '10px',
                       marginBottom: '10px'
                     }}>
                       {item.main_answer.map((answer, idx) => (
                         <div key={idx}>
                           {answer.text}
                           {/* TTS 기능은 유지하되 아이콘은 숨김 */}
                           {answer.voice && (
                             <button 
                               onClick={() => {
                                 // TTS 재생 로직
                                 console.log('TTS 재생:', answer.voice);
                               }}
                               style={{
                                 display: 'none' // TTS 아이콘 숨김
                               }}
                             >
                               🔊
                             </button>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                  
                  {/* 컴포넌트 응답 */}
                  {item.sub_data && Array.isArray(item.sub_data) && item.sub_data.length > 0 && (
                    <SubDataRenderer 
                      data={item.sub_data} 
                      onAction={(action) => {
                        console.log('컴포넌트 액션:', action);
                        // 여기서 컴포넌트의 액션 처리 (예: 버튼 클릭, 카드 선택 등)
                      }} 
                    />
                  )}
                  
                  {/* 광고 데이터 */}
                  {item.ad_data && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: '#2a3441',
                      borderRadius: '8px',
                      border: '1px solid #1A73FC'
                    }}>
                      <div style={{ color: '#1A73FC', fontSize: '14px', fontWeight: 'bold' }}>
                        💡 추천 정보
                      </div>
                      <div style={{ color: 'white', fontSize: '14px', marginTop: '5px' }}>
                        {JSON.stringify(item.ad_data, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              
                                                           ) : (
                  <div>
                    {/* 말풍선 - 항상 "찾는중..." */}
                    <div className={styles.aiMessage}>
                      <div className={styles.searchingIcon}></div>
                      찾는중...
                    </div>
                    {/* main_answer 텍스트 - 말풍선 밑에 흰색으로 */}
                    {item.main_answer && item.main_answer.length > 0 && (
                      <div style={{
                        color: 'white',
                        fontSize: '16px',
                        paddingLeft: '10px',
                        marginTop: '10px',
                        marginBottom: '10px'
                      }}>
                        {item.main_answer.map((answer, idx) => (
                          <div key={idx}>
                            {answer.text}
                            {/* TTS 기능은 유지하되 아이콘은 숨김 */}
                            {answer.voice && (
                              <button 
                                onClick={() => {
                                  // TTS 재생 로직
                                  console.log('TTS 재생:', answer.voice);
                                }}
                                style={{
                                  display: 'none' // TTS 아이콘 숨김
                                }}
                              >
                                🔊
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
      
      {/* ChatInput - 항상 하단에 고정 */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        backgroundColor: '#0B111D'
      }}>
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
      </div>
    </div>
  );
};

export default ChatPage; 