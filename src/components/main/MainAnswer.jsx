import React from 'react';
import styles from './MainAnswer.module.css';

const MainAnswer = ({ items }) => {
  return (
    <div className={styles.mainAnswerContainer}>
      {items.map((item, index) => (
        <div key={index} className={styles.answerItem}>
          <p className={styles.answerText}>{item.text}</p>
          {item.voice && (
            <button className={styles.voiceButton}>
              🔊 음성 재생
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainAnswer; 