import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemeContext';
import ChatListNew from './ChatListNew';
import ChatInput from './ChatInput';
import SubDataRenderer from '../../components/sub/SubDataRenderer';
import PersonaSelector from '../../components/PersonaSelector';
import { getSpeech } from '../../utils/getSpeech';
import { initStopwatchRef, resetClock, startClock } from '../../utils/Stopwatch';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './css/ChatPage.module.css';
import welcomeLogo from '../../assets/images/welcome_logo.png';
import { getChatAPIUrl } from '../../config/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [chatListData, setChatListData] = useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const isMsgLoadingRef = useRef(false);
  const isMsgTextingRef = useRef(false);
  const chatListDataRef = useRef([]);
  const userInputRef = useRef();
  const [mic, setMic] = useState(false);
  const [sttTimer, setSttTimer] = useState("00:00");
  const [answerAnimationKey, setAnswerAnimationKey] = useState(0);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const abortControllerRef = useRef(null);
  const userMessageRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // 세션 ID 초기화 - 매번 새로운 세션 생성
  useEffect(() => {
    // 채팅창에 들어올 때마다 새로운 세션 ID 생성
    const sessionId = 'session_' + Date.now();
    localStorage.setItem('chat_session_id', sessionId);
    console.log('새 세션 ID 생성:', sessionId);
  }, []);

  // 응답의 예상 높이를 계산하는 함수
  const calculateResponseHeight = (chat) => {
    let height = 0;
    
    // 기본 메시지 높이
    if (chat.main_answer && chat.main_answer[0]?.text) {
      const textLength = chat.main_answer[0].text.length;
      // 텍스트 길이에 따른 높이 추정 (대략적인 계산)
      height += Math.ceil(textLength / 40) * 24; // 40자당 한 줄, 줄당 24px
    }
    
    // 컴포넌트 높이
    if (chat.sub_data && Array.isArray(chat.sub_data) && chat.sub_data.length > 0) {
      height += chat.sub_data.length * 150; // 각 컴포넌트당 대략 150px
    }
    
    // ad_data 높이
    if (chat.ad_data && chat.ad_data.text) {
      const adTextLength = chat.ad_data.text.length;
      height += Math.ceil(adTextLength / 40) * 24;
    }
    
    // 기본 패딩과 마진 고려
    height += 40; // 기본 여백
    
    return height;
  };

  // 대화를 턴 단위로 그룹화하는 함수 (높이 고려)
  const groupChatsByTurn = (chats) => {
    const turns = [];
    let currentTurn = [];
    let currentTurnHeight = 0;
    const maxTurnHeight = 500; // 한 턴의 최대 높이 (px) - 더 작게 설정
    
    console.log('[groupChatsByTurn] 시작:', chats.length, '개 메시지');
    
    chats.forEach((chat, index) => {
      if (chat.speaker === 'user' || chat.type === 'user_message') {
        // 사용자 메시지가 나오면 새로운 턴 시작
        if (currentTurn.length > 0) {
          turns.push(currentTurn);
        }
        currentTurn = [chat];
        currentTurnHeight = 60; // 사용자 메시지 기본 높이
      } else {
        // AI 응답의 높이 계산
        const responseHeight = calculateResponseHeight(chat);
        
        // 현재 턴에 추가했을 때 높이가 초과되는지 확인
        if (currentTurnHeight + responseHeight > maxTurnHeight && currentTurn.length > 0) {
          // 높이가 초과되면 새로운 턴 시작
          console.log('[groupChatsByTurn] 높이 초과로 새 턴 시작:', {
            currentHeight: currentTurnHeight,
            responseHeight: responseHeight,
            maxHeight: maxTurnHeight
          });
          turns.push(currentTurn);
          currentTurn = [chat];
          currentTurnHeight = responseHeight;
        } else {
          // 현재 턴에 추가
          console.log('[groupChatsByTurn] 현재 턴에 추가:', {
            currentHeight: currentTurnHeight,
            responseHeight: responseHeight,
            newHeight: currentTurnHeight + responseHeight
          });
          currentTurn.push(chat);
          currentTurnHeight += responseHeight;
        }
      }
    });
    
    // 마지막 턴 추가
    if (currentTurn.length > 0) {
      turns.push(currentTurn);
    }
    
    console.log('[groupChatsByTurn] 완료:', turns.length, '개 턴 생성');
    return turns;
  };

  const scrollToBottom = () => {
    const chatWrapper = document.querySelector(`.${styles.chatWrapper}`);
    if (chatWrapper) {
      console.log('[scrollToBottom] 스크롤 시도:', {
        scrollTop: chatWrapper.scrollTop,
        scrollHeight: chatWrapper.scrollHeight,
        clientHeight: chatWrapper.clientHeight
      });
      
      // 자동 스크롤 플래그 설정
      isAutoScrollingRef.current = true;
      
      // 자동 스크롤 시에만 scroll-snap 일시 비활성화
      chatWrapper.style.scrollSnapType = 'none';
      
      // 여러 방법으로 스크롤 시도
      const scrollToBottomImmediate = () => {
        chatWrapper.scrollTop = chatWrapper.scrollHeight;
        console.log('[scrollToBottom] 즉시 스크롤 완료:', chatWrapper.scrollTop);
      };
      
      const scrollToBottomSmooth = () => {
        chatWrapper.scrollTo({
          top: chatWrapper.scrollHeight,
          behavior: 'smooth'
        });
        console.log('[scrollToBottom] 부드러운 스크롤 완료');
      };
      
      // 즉시 스크롤
      scrollToBottomImmediate();
      
      // DOM 업데이트 후 다시 스크롤
      requestAnimationFrame(() => {
        scrollToBottomImmediate();
      });
      
      // 부드러운 스크롤도 시도
      setTimeout(() => {
        scrollToBottomSmooth();
      }, 100);
      
      // 스크롤 완료 후 scroll-snap 복원 및 플래그 해제
      setTimeout(() => {
        chatWrapper.style.scrollSnapType = 'y proximity';
        isAutoScrollingRef.current = false;
        console.log('[scrollToBottom] 자동 스크롤 완료, scroll-snap 복원');
        
        // 스크롤 이벤트 리스너가 다시 작동하도록 강제로 이벤트 발생
        chatWrapper.dispatchEvent(new Event('scroll'));
      }, 500);
    } else {
      console.log('[scrollToBottom] chatWrapper를 찾을 수 없음');
    }
  };

  const stopResponse = () => {
    console.log('[stopResponse] 응답 중단 요청');
    
    // AbortController를 사용하여 fetch 요청 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // 로딩 상태 해제
    flushSync(() => {
      setIsMsgLoading(false);
      isMsgLoadingRef.current = false;
    });
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
    setChatListData(prev => [...prev, userMsg]); // 메시지를 쌓아서 추가
    chatListDataRef.current = [...chatListDataRef.current, userMsg];
    setShowWelcomeMessage(false); // 대화 시작 시 웰컴 메시지 완전히 숨김
    });
    
    // 사용자 메시지 추가 후 즉시 스크롤
    setTimeout(() => scrollToBottom(), 50);
    setTimeout(() => scrollToBottom(), 150);
    setTimeout(() => scrollToBottom(), 300);

    try {
      // AbortController 생성
      abortControllerRef.current = new AbortController();
      
      // 백엔드 API 통신 (config에서 URL 가져오기)
      const response = await fetch(getChatAPIUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                 body: JSON.stringify({
           user_id: data.selectedPersona ? data.selectedPersona.user_id.toString() : (selectedPersona ? selectedPersona.user_id.toString() : "1"),
           chat_id: localStorage.getItem('chat_session_id'),
           text: data.msg
         }),
        signal: abortControllerRef.current.signal
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
              // 응답 데이터 로깅
              console.log('Raw response data:', data);
              
              // 빈 데이터나 유효하지 않은 데이터 체크
              if (!data || data.trim() === '') {
                console.log('Empty data received, skipping...');
                continue;
              }
              
              // Python 딕셔너리 형식을 JSON으로 변환
              let jsonData = data;
              if (data.startsWith('{') && data.endsWith('}')) {
                // 작은따옴표를 큰따옴표로 변환
                jsonData = data.replace(/'/g, '"');
                // None을 null로 변환
                jsonData = jsonData.replace(/None/g, 'null');
                // True를 true로 변환
                jsonData = jsonData.replace(/True/g, 'true');
                // False를 false로 변환
                jsonData = jsonData.replace(/False/g, 'false');
              }
              
              const parsed = JSON.parse(jsonData);
              
              // 백엔드 응답 형식에 맞게 처리
              let botMessage = null;
              if (parsed.bot_msg_list && parsed.bot_msg_list.length > 0) {
                botMessage = parsed.bot_msg_list[0];
              } else {
                botMessage = parsed; // 기존 형식 호환성 유지
              }
              
                             // loading 타입이면 로딩 메시지 표시 (스트리밍 효과 포함)
               if (botMessage.type === 'loading') {
                 // 첫 번째 loading이면 새 메시지 추가, 아니면 기존 메시지 교체
                 if (!hasLoadingStarted) {
                   hasLoadingStarted = true;
                   
                   // 빈 텍스트로 로딩 메시지 시작
                   const loadingMsg = {
                     speaker: 'chatbot',
                     type: 'loading',
                     main_answer: [{ text: '', voice: '' }],
                     sub_data: botMessage.sub_data
                   };
                   
                                                                                                   flushSync(() => {
                      setChatListData(prev => [...prev, loadingMsg]);
                      chatListDataRef.current = [...chatListDataRef.current, loadingMsg];
                      setIsMsgLoading(true);
                      isMsgLoadingRef.current = true;
                    });
                 }
                 
                 // 스트리밍 효과로 로딩 텍스트 표시
                 const loadingText = botMessage.main_answer[0]?.text || '찾는중...';
                 let currentText = '';
                 
                 // 로딩 텍스트를 한 글자씩 추가
                 for (let i = 0; i < loadingText.length; i++) {
                   await new Promise(resolve => setTimeout(resolve, 30)); // 30ms 딜레이 (로딩은 더 빠르게)
                   currentText += loadingText[i];
                   
                   flushSync(() => {
                     setChatListData(prev => {
                       const newList = [...prev];
                       const lastIndex = newList.length - 1;
                       
                       if (lastIndex >= 0) {
                         newList[lastIndex] = {
                           ...newList[lastIndex],
                           main_answer: [{ text: currentText, voice: loadingText }]
                         };
                       }
                       
                       chatListDataRef.current = newList;
                       return newList;
                     });
                   });
                   
                   // 스트리밍 중에도 스크롤 유지
                   setTimeout(() => scrollToBottom(), 10);
                   setTimeout(() => scrollToBottom(), 50);
                 }
               }
               

              
                                                           
                
                                 // answer 타입이 오면 스트리밍 완료 표시
                 if (botMessage.type === 'answer' && !hasComponentResponse) {
                   hasComponentResponse = true;
                   
                   // 로딩 상태는 스트리밍이 완료될 때까지 유지 (중지 버튼 표시를 위해)
                   
                   // 스트리밍 효과로 텍스트 표시
                   const fullText = botMessage.main_answer[0]?.text || '';
                   let currentText = '';
                   
                   // 기존 메시지를 answer로 교체 (빈 텍스트로 시작)
                   flushSync(() => {
                     setChatListData(prev => {
                       const newList = [...prev];
                       const lastIndex = newList.length - 1;
                       
                                                if (lastIndex >= 0) {
                           newList[lastIndex] = {
                             speaker: 'chatbot',
                             type: 'answer',
                             main_answer: [{ text: '', voice: '' }],
                             sub_data: [], // 빈 배열로 시작
                             ad_data: null // null로 시작
                           };
                         }
                       
                       chatListDataRef.current = newList;
                       return newList;
                     });
                   });
                   
                   // 텍스트를 한 글자씩 추가
                   for (let i = 0; i < fullText.length; i++) {
                     await new Promise(resolve => setTimeout(resolve, 10)); // 10ms 딜레이 (매우 빠른 스트리밍)
                     currentText += fullText[i];
                     
                     flushSync(() => {
                       setChatListData(prev => {
                         const newList = [...prev];
                         const lastIndex = newList.length - 1;
                         
                         if (lastIndex >= 0) {
                           newList[lastIndex] = {
                             ...newList[lastIndex],
                             main_answer: [{ text: currentText, voice: fullText }]
                           };
                         }
                         
                         chatListDataRef.current = newList;
                         return newList;
                       });
                     });
                     
                     // 스트리밍 중에도 스크롤 유지
                     setTimeout(() => scrollToBottom(), 10);
                     setTimeout(() => scrollToBottom(), 50);
                   }
                   
                   // 스트리밍 완료 후 sub_data 추가 (0.5초 후)
                   if (botMessage.sub_data && Array.isArray(botMessage.sub_data) && botMessage.sub_data.length > 0) {
                     setTimeout(() => {
                       flushSync(() => {
                         setChatListData(prev => {
                           const newList = [...prev];
                           const lastIndex = newList.length - 1;
                           
                           if (lastIndex >= 0) {
                             newList[lastIndex] = {
                               ...newList[lastIndex],
                               sub_data: botMessage.sub_data
                             };
                           }
                           
                           chatListDataRef.current = newList;
                           return newList;
                         });
                       });
                       
                       // sub_data 추가 후 스크롤
                       setTimeout(() => scrollToBottom(), 50);
                       setTimeout(() => scrollToBottom(), 150);
                       
                       // ad_data 추가 (0.3초 후)
                       if (botMessage.ad_data && Object.keys(botMessage.ad_data).length > 0) {
                         setTimeout(() => {
                           flushSync(() => {
                             setChatListData(prev => {
                               const newList = [...prev];
                               const lastIndex = newList.length - 1;
                               
                               if (lastIndex >= 0) {
                                 newList[lastIndex] = {
                                   ...newList[lastIndex],
                                   ad_data: botMessage.ad_data
                                 };
                               }
                               
                               chatListDataRef.current = newList;
                               return newList;
                             });
                           });
                           
                           // ad_data 추가 후 스크롤
                           setTimeout(() => scrollToBottom(), 50);
                           setTimeout(() => scrollToBottom(), 150);
                         }, 300);
                       }
                     }, 500);
                   }
                   
                   // 스트리밍 완료 후 로딩 상태 해제 (중지 버튼을 마이크 버튼으로 변경)
                   flushSync(() => {
                     setIsMsgLoading(false);
                     isMsgLoadingRef.current = false;
                     // 응답 완료 후 애니메이션 키 트리거 (응답 메시지만 애니메이션 적용)
                     setAnswerAnimationKey(prev => prev + 1);
                   });
                   
                 }
              
                                                           
              
            } catch (e) {
              console.error('JSON 파싱 에러:', e);
              console.error('Problematic data:', data);
              // JSON 파싱 실패 시에도 계속 진행
              continue;
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
      
      // AbortError인 경우 조용히 처리 (중단 메시지 표시하지 않음)
      if (error.name === 'AbortError') {
        console.log('API 요청이 중단되었습니다.');
        return;
      }
      
      // 일반 에러 메시지 표시
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

    // 로딩 상태 시작
    setIsMsgLoading(true);
    isMsgLoadingRef.current = true;
    
    // 입력 필드 즉시 초기화
    if (userInputRef.current && userInputRef.current.value !== undefined) {
      userInputRef.current.value = '';
    }

    await sendMsgToBotByComponent({ msg: userInput.trim() });
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
    // 메시지가 추가될 때마다 맨 아래로 스크롤
    if (chatListData.length > 0) {
      scrollToBottom();
      // 여러 번 스크롤 시도
      setTimeout(() => scrollToBottom(), 100);
      setTimeout(() => scrollToBottom(), 300);
      setTimeout(() => scrollToBottom(), 500);
    }
  }, [chatListData]); // 메시지가 추가될 때마다 실행

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const chatWrapper = document.querySelector(`.${styles.chatWrapper}`);
    if (chatWrapper) {
      const handleScroll = () => {
        // 자동 스크롤 중이 아닐 때만 scroll-snap 활성화
        if (!isAutoScrollingRef.current) {
          // 스크롤 중에는 scroll-snap 비활성화
          chatWrapper.style.scrollSnapType = 'none';
          
          // 스크롤이 멈춘 후에 scroll-snap 활성화
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = setTimeout(() => {
            if (!isAutoScrollingRef.current) {
              chatWrapper.style.scrollSnapType = 'y proximity';
              console.log('[handleScroll] scroll-snap 활성화');
            }
          }, 200); // 스크롤이 멈춘 후 200ms 후 활성화
        }
      };
      
      chatWrapper.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        chatWrapper.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []); // 컴포넌트 마운트 시 한 번만 설정

  // 웰컴메시지 상태 관리
  useEffect(() => {
    setShowWelcomeMessage(true);
  }, []);

  const handleCloseChat = () => {
    setShowWelcomeMessage(false);
    navigate('/');
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setShowPersonaSelector(false);
    
    // 페르소나 선택 시 "내 프로파일 알려줘" 메시지로 API 호출
    // persona 객체를 직접 사용하여 user_id 전달
    sendMsgToBotByComponent({ msg: "내 프로파일 알려줘", selectedPersona: persona });
  };

  const handleClosePersonaSelector = () => {
    setShowPersonaSelector(false);
  };



  return (
    <div className={`${styles.chatPage} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* 페르소나 선택기 */}
      {showPersonaSelector && (
        <PersonaSelector
          onPersonaSelect={handlePersonaSelect}
          onClose={handleClosePersonaSelector}
        />
      )}

      {/* 메인 콘텐츠 영역 */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 180px)', /* ChatInput 높이 + 상단 아이콘 영역 제외 */
        overflow: 'hidden',
        paddingTop: '80px' /* 상단 아이콘들 아래에서 충분한 여백 확보 */
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
                       <div className={styles.chatWrapper}>
             
             {groupChatsByTurn(chatListData).map((turn, turnIndex) => (
               <div key={`turn-${turnIndex}`} className={styles.chatTurn}>
                 {turn.map((item, index) => (
                   <div key={`${turnIndex}-${index}-${item.type}${item.type === 'answer' ? `-${answerAnimationKey}` : ''}`} className={styles.messageContainer}>
                     {item.speaker === 'user' || item.type === 'user_message' ? (
                       <div 
                         ref={turnIndex === groupChatsByTurn(chatListData).length - 1 && index === 0 ? userMessageRef : null}
                         className={styles.userMessage}
                       >
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
                                 <div dangerouslySetInnerHTML={{ __html: answer.text }} />
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
                       <div className={styles.answerSlideIn}>
                         {/* 말풍선 - 축소되는 말풍선 */}
                         <div className={`${styles.aiMessage} ${styles.collapsing}`}>
                           <div className={`${styles.searchingIcon} ${styles.answerSpinning}`}></div>
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
                                 <div dangerouslySetInnerHTML={{ __html: answer.text }} />
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
                         
                         {/* 추가 텍스트 (ad_data) */}
                         {item.ad_data && item.ad_data.text && (
                           <div style={{
                             color: 'white',
                             fontSize: '14px',
                             paddingLeft: '10px',
                             marginTop: '10px',
                             marginBottom: '10px',
                             lineHeight: '1.5'
                           }}>
                             <div dangerouslySetInnerHTML={{ __html: item.ad_data.text }} />
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
                                 <div dangerouslySetInnerHTML={{ __html: answer.text }} />
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
            onStopResponse={stopResponse}
            isLoading={isMsgLoading}
            userInputRef={userInputRef}
            mic={mic}
            handleMicClick={handleMicClick}
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
            sttTimer={sttTimer}
            isChatOpen={true}
            onClose={handleCloseChat}
            onInputClick={() => !selectedPersona && setShowPersonaSelector(true)}
          />
      </div>
      </div>
    </div>
  );
};

export default ChatPage; 