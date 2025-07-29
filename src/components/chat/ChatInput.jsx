import React, { useEffect, useState } from "react";
import styles from "./css/chatInput.module.css";
import { RiArrowUpLine, RiMicLine } from "react-icons/ri";
import { ReactComponent as VoiceSvg } from "../../assets/images/voice.svg";
import { useTheme } from "../ThemeContext";

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
        isLoading
          ? isDarkMode
            ? styles.darkSkeletonContainer
            : styles.skeletonContainer
          : isDarkMode
          ? styles.darkContainer
          : styles.container
      }`}
    >
      {isLoading ? (
        <div className={styles.wrap}>
          <span className={styles.skeletonIcon} />

          <div className={styles.skeletonInput}>
            <span className={styles.skeletonIcon} />
          </div>
        </div>
      ) : (
        <div className={styles.wrap}>
          <button onClick={handleMicClick}>
            <RiMicLine
              className={`${isDarkMode ? styles.darkMicIcon : styles.micIcon} ${mic ? styles.fillmicIcon : ""}`}
            />
          </button>
          <div
            className={`${isDarkMode ? styles.darkWrapInput : styles.wrapInput} ${mic ? styles.fillWarpInput : ""}`}
          >
            {mic && (
              <>
                <VoiceSvg />
                <span className={`${styles.mmss}`}>{sttTimer}</span>
              </>
            )}

            <input
              style={mic ? { display: "none" } : {}}
              ref={userInputRef}
              className={`${isDarkMode ? styles.darkInput : styles.input}`}
              type='text'
              placeholder={placeholder}
              onKeyDown={_onKeyDown}
              onFocus={() => {
                // 입력창 포커스 시 채팅창 열기
                if (!isChatOpen) {
                  onSendButtonClick("");
                }
              }}
              onClick={() => {
                // 입력창 클릭 시 채팅창 열기
                if (!isChatOpen) {
                  onSendButtonClick("");
                }
              }}
            />
            <button
              onClick={() => {
                console.log('[ChatInput] 전송 버튼 클릭');
                console.log('[ChatInput] 입력값:', userInputRef.current.value);
                onSendButtonClick(userInputRef.current.value);
              }}
            >
              {/* <QuestionSvg className={styles.icon} /> */}
              <RiArrowUpLine
                className={`${isDarkMode ? styles.darkSendIcon : styles.sendIcon} ${
                  mic ? styles.fillsendIconWhite : styles.fillsendIconGray
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
