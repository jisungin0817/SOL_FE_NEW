import React from 'react';
import styles from './SubButtons.module.css';

const SubButtons = ({ data, onAction }) => {
  const handleButtonClick = (button) => {
    if (onAction && button.action) {
      onAction(button.action, button.value);
    }
  };

  // 버튼 개수에 따라 클래스명 결정
  const getButtonLayoutClass = () => {
    const buttonCount = data.length;
    
    if (buttonCount === 1) return styles.singleButton;
    if (buttonCount === 2) return styles.twoButtons;
    return styles.multipleButtons;
  };

  return (
    <div className={styles.buttonsContainer}>
      <div className={`${styles.buttonsGrid} ${getButtonLayoutClass()}`}>
        {data.map((button, index) => (
          <button
            key={index}
            className={styles.button}
            onClick={() => handleButtonClick(button)}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubButtons; 