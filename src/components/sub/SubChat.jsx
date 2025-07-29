import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as BearIcon } from "../../assets/images/Bear_icon.svg";
import { ReactTyped } from "react-typed";
import { ReactComponent as HeadPhoneSvg } from "../../assets/icons/headPhone.svg";
import { ReactComponent as MicSvg } from "../../assets/icons/mic.svg";
import { ReactComponent as LoadingSvg } from "../../assets/icons/loading.svg";
import { useTheme } from "../ThemeContext";
import styles from "./SubChat.module.css";

const SubChat = ({ data, onAction }) => {
  const { isDarkMode, fontSize } = useTheme();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

  const aiStatusIcon = () => {
    if (aiStatus === "mic") {
      return <MicSvg className={styles.aiStatusIcon} />;
    } else if (aiStatus === "headPhone") {
      return <HeadPhoneSvg className={styles.aiStatusIcon} />;
    } else if (aiStatus === "loading") {
      return <LoadingSvg className={styles.aiStatusIcon} />;
    } else {
      return null;
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={isDarkMode ? styles.darkAiIcon : styles.aiIcon}>
        {isDarkMode ? (
          <div className={styles.darkAiAvatar}>
            <div className={styles.darkAiRing}></div>
            <div className={styles.darkAiGlow}></div>
          </div>
        ) : (
          <BearIcon />
        )}
        {aiStatusIcon()}
      </div>
      
      <div className={`${isDarkMode ? styles.darkAiMessage : styles.aiMessage} ${
        fontSize === "large" && styles.largeText
      }`}>
        {data && data.main_answer && data.main_answer.length > 0 ? (
          (() => {
            const textArray = data.main_answer
              .filter(item => item && typeof item === 'object' && item.text)
              .map(item => String(item.text || ""))
              .filter(text => text.trim() !== ""); // 빈 문자열 필터링
            
            // 텍스트가 없으면 로딩 표시
            if (textArray.length === 0) {
              return (
                <div className={styles.loadingMessage}>
                  <LoadingSvg className={styles.loadingIcon} />
                  <span>응답을 준비하고 있습니다...</span>
                </div>
              );
            }
            
            return (
              <ReactTyped
                strings={textArray}
                typeSpeed={50}
                backSpeed={0}
                backDelay={0}
                loop={false}
                showCursor={false}
                cursorChar="|"
                onComplete={() => {
                  console.log("타이핑 완료");
                  setIsTypingComplete(true);
                }}
              />
            );
          })()
        ) : (
          <div className={styles.loadingMessage}>
            <LoadingSvg className={styles.loadingIcon} />
            <span>응답을 준비하고 있습니다...</span>
          </div>
        )}
      </div>
      
      {data && data.sub_data && isTypingComplete && (
        <div className={styles.subDataContainer}>
          {data.sub_data.map((item, index) => (
            <div key={index} className={styles.simpleCard}>
              <h4>{item.type || '카드'} {index + 1}</h4>
              <p>{JSON.stringify(item.data, null, 2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubChat; 