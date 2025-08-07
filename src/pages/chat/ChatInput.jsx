import React, { useEffect, useState } from "react";
import styles from "./css/chatInput.module.css";
import { RiArrowUpLine, RiMicLine } from "react-icons/ri";
import { ReactComponent as VoiceSvg } from "../../assets/images/voice.svg";
import { useTheme } from "../../components/ThemeContext";
import clockIcon from "../../assets/images/clock.png";
import closeIcon from "../../assets/images/close-window.png";
import micIcon from "../../assets/images/mic.png";
import stopButtonIcon from "../../assets/images/stop-button.png";

const ChatInput = (props) => {
  const {
    onSendButtonClick,
    onStopResponse,
    isLoading,
    userInputRef,
    mic,
    handleMicClick,
    browserSupportsSpeechRecognition,
    sttTimer,
    isChatOpen,
    onClose,
    onInputClick,
  } = props;
  const { isDarkMode } = useTheme();
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    // 기본 placeholder 설정
    setPlaceholder("메시지를 입력하세요...");
  }, []);

  useEffect(() => {
    // console.log("######################################################################");
    if (isChatOpen) {
      // console.log("isChatOpen >>", isChatOpen);
      setPlaceholder("");
    }
  }, [isChatOpen]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  function _onKeyDown(e) {
    console.log('[ChatInput] 키 이벤트:', e.key);
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      console.log('[ChatInput] Enter 키 입력');
      onSendButtonClick(userInputRef.current.value);
    }
  }

  function _onInputClick() {
    // input 클릭 시 페르소나 선택기 표시 (한 번만)
    if (onInputClick) {
      onInputClick();
    }
  }



  return (
    <div
      className={`${
        isDarkMode
          ? styles.darkContainer
          : styles.container
      }`}
    >
      <div className={styles.wrap}>
                                  <textarea
            ref={userInputRef}
            className={styles.input}
            placeholder="궁금한점을 물어볼 수 있어요."
            onKeyDown={_onKeyDown}
            onClick={_onInputClick}
            disabled={isLoading}
            rows={1}
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'text',
            fontFamily: 'inherit',
            resize: 'none',
            height: '100%'
          }}
        />
        <button 
          className={styles.micButton} 
          disabled={false}
          onClick={isLoading ? onStopResponse : handleMicClick}
          style={{ 
            opacity: 1,
            cursor: 'pointer'
          }}
        >
          <img 
            src={isLoading ? stopButtonIcon : micIcon} 
            alt={isLoading ? "중지" : "마이크"} 
            className={styles.micIcon} 
          />
        </button>
      </div>
      
      {/* 우측 상단 아이콘들 */}
      <div className={styles.topIcons}>
        <button className={styles.historyButton}>
          <img src={clockIcon} alt="히스토리" className={styles.clockIcon} />
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 