import React, {useEffect, useRef, useState} from "react";
import styles from "./css/chatList.module.css";
import { ReactComponent as BearIcon } from "../../assets/images/Bear_icon.svg";
import { ReactComponent as HeadPhoneSvg } from "../../assets/icons/headPhone.svg";
import { ReactComponent as MicSvg } from "../../assets/icons/mic.svg";
import { ReactComponent as LoadingSvg } from "../../assets/icons/loading.svg";
// CommonCard import 제거
import {useTheme} from "../ThemeContext";

// 케이스별로 사용할때 예시
const AIChatBoxLoading = (props) => {
  const { index, msg, playVoice, handleIsMsgLoading, data, setData, isMsgLoadingRef, scrollToBottom, sendMsgToBotByComponent, isPageNew } = props;
  const [aiStatus, setAiStatus] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [subData, setSubData] = useState(false);
  const [subDataType, setSubDataType] = useState("");
  const subDataTypeRef = useRef("");
  const cardRef = useRef([]);
  const { isDarkMode, fontSize } = useTheme();
  const card = (data) => {
    return (
      <div className={styles.simpleCard}>
        <h4>로딩 카드</h4>
        <p>{JSON.stringify(data, null, 2)}</p>
      </div>
    );
  };

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

  const getLoadingText = (mainAnswer) => {
    const text = [];
    if (mainAnswer && Array.isArray(mainAnswer)) {
      for (const answer of mainAnswer) {
        if (answer && typeof answer === 'object' && answer.text !== undefined && answer.text !== null) {
          const textValue = String(answer.text || "");
          if (textValue && textValue.trim() !== "") {
            text.push(textValue);
          }
        }
      }
    }
    return text;
  }

  return (
    <div key={"AIChatBoxLoading"}  className={styles.aiBox}>
      {/* 아이콘 */}
      <div className={styles.aiIcon}>
        <BearIcon />
        {aiStatusIcon()}
      </div>
      {/* 메세지 */}
      <div
          className={`${isDarkMode ? styles.darkAiMessage : styles.aiMessage} ${
              fontSize === "large" && styles.largeText
          }`}
      >
        <div>
          {getLoadingText(msg.main_answer || msg.mainAnswer).map((text, index) => (
            <div key={index}>{text}</div>
          ))}
        </div>
      </div>
      {showCard && (
          cardRef.current.map( item => (
              item
          ))
      )}
    </div>
  );
};

export default AIChatBoxLoading;
