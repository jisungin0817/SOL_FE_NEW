import React from 'react';
import { SubButtonData } from '../../types/chatTypes';
import styles from './SubButtons.module.css';

interface SubButtonsProps {
  data: SubButtonData['data'];
  onAction?: (action: string, value?: any) => void;
}

const SubButtons: React.FC<SubButtonsProps> = ({ data, onAction }) => {
  const handleButtonClick = (button: { text: string; action?: string; value?: any }) => {
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