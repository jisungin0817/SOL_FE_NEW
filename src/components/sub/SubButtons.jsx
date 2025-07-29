import React from 'react';
import styles from './SubButtons.module.css';

const SubButtons = ({ data, onAction }) => {
  const handleButtonClick = (button) => {
    if (onAction && button.action) {
      onAction(button.action, button.value);
    }
  };

  return (
    <div className={styles.buttonsContainer}>
      <div className={styles.buttonsGrid}>
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