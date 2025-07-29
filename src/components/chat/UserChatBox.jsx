import React from "react";
import styles from "./css/chatList.module.css";
import {useTheme} from "../ThemeContext";
import {ReactTyped} from "react-typed";

const UserChatBox = (props) => {
  const { index, msg, scrollToBottom  } = props;
    const { isDarkMode, fontSize, toggleDarkMode, changeFontSize } = useTheme();

  return (
      <div className={styles.chatBox} key={index}>
        <div
            className={`${isDarkMode ? styles.darkMessage : styles.message} ${
                fontSize === "large" && styles.largeText
            }`}
        >
          <span>
            {msg && msg.trim() !== "" ? (
              <ReactTyped
                  typeSpeed={10}
                  showCursor={false}
                  strings={[msg]}
                  // onComplete={scrollToBottom}
              />
            ) : (
              <span>메시지가 없습니다.</span>
            )}
          </span>
        </div>
      </div>
  );
};

export default UserChatBox;
