import React, {useRef, useState, useEffect, useCallback} from "react";
import styles from "./css/ChatComponent.module.css";
import { ReactComponent as BearIcon } from "../../assets/images/Bear_icon.svg";
import { ReactTyped } from "react-typed";
import { ReactComponent as HeadPhoneSvg } from "../../assets/icons/headPhone.svg";
import { ReactComponent as MicSvg } from "../../assets/icons/mic.svg";
import { ReactComponent as LoadingSvg } from "../../assets/icons/loading.svg";
import { useTheme } from "../ThemeContext";

const AIChatBox = (props) => {
  const { index, msg, playVoice, handleIsMsgLoading, data, setData, isMsgLoadingRef, scrollToBottom, sendMsgToBotByComponent, isPageNew } = props;
  
  const [aiStatus, setAiStatus] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [showAdCard, setAdShowCard] = useState(false);
  const [subData, setSubData] = useState(false);
  const [subDataType, setSubDataType] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const subDataTypeRef = useRef("");
  const cardRef = useRef([]);
  const adCardRef = useRef();
  const { isDarkMode, fontSize } = useTheme();

  const card = useCallback((data, type) => {
    console.log("card 함수 호출 >>", type);
    console.log("card data >>", data);
    
    // 간단한 카드 컴포넌트 반환 (기존 디자인 유지)
    return (
      <div className={styles.simpleCard}>
        <h4>{type} 카드</h4>
        <p>{JSON.stringify(data, null, 2)}</p>
      </div>
    );
  }, [index, sendMsgToBotByComponent, scrollToBottom, isPageNew]);

  const adCard = useCallback((data) => {
    console.log("adCard 함수 호출 >>", data);
    
    return (
      <div className={styles.simpleAdCard}>
        <h4>광고 카드</h4>
        <p>{JSON.stringify(data, null, 2)}</p>
      </div>
    );
  }, []);

  const processCards = useCallback(() => {
    if (!msg || !msg.sub_data) return;

    const subDataList = Array.isArray(msg.sub_data) ? msg.sub_data : [msg.sub_data];
    
    cardRef.current = subDataList.map((item, idx) => {
      if (item && item.type) {
        return card(item.data, item.type);
      }
      return null;
    }).filter(Boolean);

    if (cardRef.current.length > 0) {
      setShowCard(true);
    }

    // ad_data 처리
    if (msg.ad_data && msg.ad_data.hasOwnProperty && msg.ad_data.hasOwnProperty("ad_main_answer")) {
      console.log("msg.ad_data  >> ", msg.ad_data);
      adCardRef.current = adCard(msg.ad_data);
      setAdShowCard(true);
    }

    isMsgLoadingRef.current = false;
  }, [msg, card, adCard, isMsgLoadingRef]);

  useEffect(() => {
    if (!msg) return;
    
    cardRef.current = [];
    setShowCard(false);
    setAdShowCard(false);
    setIsTypingComplete(false);
    
    processCards();
  }, [msg, processCards]);

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
    <div key={"AIChatBox"} className={styles.aiBox}>
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
        {msg && msg.type === 'loading' ? (
          <div className={styles.loadingMessage}>
            <LoadingSvg className={styles.loadingIcon} />
            <span>응답을 준비하고 있습니다...</span>
          </div>
        ) : msg && msg.main_answer && msg.main_answer.length > 0 ? (
          (() => {
            const textArray = msg.main_answer
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
      
      {showCard && isTypingComplete && (
        cardRef.current.map((item, index) => (
          <React.Fragment key={`card-${index}`}>
            {item}
          </React.Fragment>
        ))
      )}
      
      {showAdCard && adCardRef.current}
    </div>
  );
};

export default AIChatBox;
