import React from 'react';
import MainAnswer from '../main/MainAnswer';
import SubDataRenderer from '../sub/SubDataRenderer';
import styles from './ChatRenderer.module.css';

const ChatRenderer = ({ message, onAction }) => {
  const isUser = message.speaker === 'user';
  const isBot = message.speaker === 'chatbot';

  if (isUser) {
    return (
      <div className={styles.userMessageContainer}>
        <div className={styles.userMessage}>
          <p>{message.main_answer?.[0]?.text || '사용자 메시지'}</p>
        </div>
      </div>
    );
  }

  if (isBot) {
    return (
      <div className={styles.botMessageContainer}>
        <div className={styles.botMessage}>
          {message.main_answer && message.main_answer.length > 0 && (
            <MainAnswer items={message.main_answer} />
          )}
          
          {message.sub_data && message.sub_data.length > 0 && (
            <SubDataRenderer data={message.sub_data} onAction={onAction} />
          )}
          
          {message.type === 'loading' && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>답변을 생성하고 있습니다...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ChatRenderer; 