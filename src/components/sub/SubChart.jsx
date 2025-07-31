import React from 'react';
import styles from './SubChart.module.css';

const SubChart = ({ data }) => {
  const renderChart = () => {
    const { chartTitle, chartData, description } = data;
    
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>{chartTitle}</h3>
        </div>
        
        <div className={styles.chartContent}>
          <div className={styles.chartArea}>
            <svg className={styles.chartSvg} viewBox="0 0 300 150">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={30 + i * 24}
                  x2="300"
                  y2={30 + i * 24}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              ))}
              
              {/* Chart line */}
              <path
                d="M 0 120 Q 50 100 75 80 T 150 60 T 225 40 T 300 30"
                stroke="#ef4444"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className={styles.chartDescription}>
            <p className={styles.descriptionText}>{description.main}</p>
            <p className={styles.descriptionSub}>{description.sub}</p>
            <p className={styles.descriptionNote}>{description.note}</p>
          </div>
        </div>
      </div>
    );
  };

  return renderChart();
};

export default SubChart; 