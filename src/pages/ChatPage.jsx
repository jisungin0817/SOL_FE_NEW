import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import ChatListNew from '../components/chat/ChatListNew';
import ChatInput from '../components/chat/ChatInput';
import { getSpeech } from '../utils/getSpeech';
import { initStopwatchRef, resetClock, startClock } from '../utils/Stopwatch';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [chatListData, setChatListData] = useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
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
      // SSE API 호출
      const response = await fetch('http://m1.geniemars.kt.co.kr:10665/v1/chat/completions', {
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
            
            if (data === '[DONE]') {
              // 스트림 완료
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
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
                // 답변 메시지 처리
                const content = parsed.choices[0].delta.content;
                
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
                    // 기존 답변에 텍스트 추가
                    lastMsg.main_answer[0].text += content;
                  }
                  
                  return newData;
                });
                
                // 로딩 상태 해제
                setIsMsgLoading(false);
                isMsgLoadingRef.current = false;
                
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
      
      // 에러 메시지 표시
      const errorMsg = {
        speaker: 'chatbot',
        type: 'answer',
        main_answer: [{ text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.' }]
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

  // 슬라이드 애니메이션 완료 후 웰컴 메시지 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(true);
      const welcomeMessage = {
        speaker: 'chatbot',
        type: 'answer',
        main_answer: [{ text: '안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요?' }]
      };
      setChatListData([welcomeMessage]);
      chatListDataRef.current = [welcomeMessage];
    }, 600); // 슬라이드 애니메이션(0.5s) + 여유시간(0.1s)

    return () => clearTimeout(timer);
  }, []);

  const handleCloseChat = () => {
    navigate('/');
  };

  return (
    <div className={`${styles.chatPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.chatContainer}>
        <ChatListNew
          isOpen={true} // Always open on ChatPage
          onClose={() => navigate('/')} // X 버튼 클릭 시 메인 페이지로 이동
          data={chatListData}
          setData={setChatListData}
          handleIsMsgLoading={setIsMsgLoading}
          isMsgLoadingRef={isMsgLoadingRef}
          isMsgTextingRef={isMsgTextingRef}
          sendMsgToBotByComponent={sendMsgToBotByComponent}
          isPageNew={true}
        />
      </div>
      <ChatInput
        onSendButtonClick={handleSendButtonClick}
        isLoading={isMsgLoading}
        userInputRef={userInputRef}
        mic={mic}
        handleMicClick={handleMicClick}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        sttTimer={sttTimer}
        isChatOpen={true}
      />
    </div>
  );
};

export default ChatPage; 