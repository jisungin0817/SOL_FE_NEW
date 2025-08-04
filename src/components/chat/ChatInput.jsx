import React, { useEffect, useState } from "react";
import styles from "./css/chatInput.module.css";
import { RiArrowUpLine, RiMicLine } from "react-icons/ri";
import { ReactComponent as VoiceSvg } from "../../assets/images/voice.svg";
import { useTheme } from "../ThemeContext";
import clockIcon from "../../assets/images/clock.png";
import closeIcon from "../../assets/images/close-window.png";
import micIcon from "../../assets/images/mic.png";

const ChatInput = (props) => {
  const {
    onSendButtonClick,
    isLoading,
    userInputRef,
    mic,
    handleMicClick,
    browserSupportsSpeechRecognition,
    sttTimer,
    isChatOpen,
    onClose,
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
    if (e.key === 'Enter') {
      console.log('[ChatInput] Enter 키 입력');
      onSendButtonClick(userInputRef.current.value);
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
        <input
          ref={userInputRef}
          className={styles.input}
          type='text'
          placeholder="궁금한점을 물어볼 수 있어요."
          onKeyDown={_onKeyDown}
          disabled={isLoading}
        />
        <button className={styles.micButton} disabled={isLoading}>
          <img src={micIcon} alt="마이크" className={styles.micIcon} />
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
