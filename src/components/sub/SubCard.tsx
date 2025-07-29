import React from 'react';
import { SubCardData } from '../../types/chatTypes';
import styles from './SubCard.module.css';

interface SubCardProps {
  data: SubCardData['data'];
  onAction?: (action: string, value?: any) => void;
}

const SubCard: React.FC<SubCardProps> = ({ data, onAction }) => {
  const handleActionClick = (action: { text: string; action: string }) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{data.title}</h3>
        {data.image && (
          <div className={styles.cardImage}>
            <img src={data.image} alt={data.title} />
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <p className={styles.cardText}>{data.content}</p>
      </div>
      
      {data.actions && data.actions.length > 0 && (
        <div className={styles.cardActions}>
          {data.actions.map((action, index) => (
            <button
              key={index}
              className={styles.actionButton}
              onClick={() => handleActionClick(action)}
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCard; 