import React from 'react';
import styles from './SubCard.module.css';

const SubCard = ({ data, onAction }) => {
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  // data가 배열인 경우 처리
  const cardData = Array.isArray(data) ? data : [data];

  return (
    <div className={styles.productCardContainer}>
      {cardData.map((product, index) => (
        <div key={index} className={styles.productCard}>
          <div className={styles.productInfo}>
            <div className={styles.productName}>{product.product_name}</div>
            {product.product_sub_name && (
              <div className={styles.productSubName}>{product.product_sub_name}</div>
            )}
          </div>
          
          <button
            className={styles.productButton}
            onClick={() => handleActionClick(product.action)}
          >
            {product.button_text}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubCard; 