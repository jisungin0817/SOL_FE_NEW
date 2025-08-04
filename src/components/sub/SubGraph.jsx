import React from 'react';
import styles from './SubGraph.module.css';

const SubGraph = ({ data }) => {
  const { title, description, portfolio } = data;
  
  return (
    <div className={styles.portfolioContainer}>
      <div className={styles.portfolioHeader}>
        <h3 className={styles.portfolioTitle}>{title}</h3>
        <p className={styles.portfolioDescription}>{description}</p>
      </div>
      
      <div className={styles.chartArea}>
        <div className={styles.barChart}>
          <div className={styles.barContainer}>
            <div 
              className={styles.barSegment}
              style={{ 
                width: `${portfolio.fund}%`,
                backgroundColor: '#3b82f6'
              }}
            >
              <span className={styles.percentageLabel}>{portfolio.fund}%</span>
            </div>
            <div 
              className={styles.barSegment}
              style={{ 
                width: `${portfolio.savings}%`,
                backgroundColor: '#06b6d4'
              }}
            >
              <span className={styles.percentageLabel}>{portfolio.savings}%</span>
            </div>
          </div>
        </div>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
            <span className={styles.legendText}>{portfolio.fundLabel}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#06b6d4' }}></div>
            <span className={styles.legendText}>{portfolio.savingsLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubGraph; 