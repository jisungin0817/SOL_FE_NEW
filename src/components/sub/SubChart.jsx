import React from 'react';
import styles from './SubChart.module.css';

const SubChart = ({ data }) => {
  const renderChartPlaceholder = () => {
    const { chartType, labels, datasets } = data;
    
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>{chartType.toUpperCase()} 차트</h3>
        </div>
        
        <div className={styles.chartContent}>
          <div className={styles.chartPlaceholder}>
            <p>차트 타입: {chartType}</p>
            <p>라벨 수: {labels.length}</p>
            <p>데이터셋 수: {datasets.length}</p>
            <p className={styles.chartNote}>실제 차트는 Chart.js 또는 D3.js 연동 필요</p>
          </div>
          
          <div className={styles.dataPreview}>
            <h4>데이터 미리보기:</h4>
            <div className={styles.labelsList}>
              <strong>라벨:</strong> {labels.join(', ')}
            </div>
            {datasets.map((dataset, index) => (
              <div key={index} className={styles.datasetItem}>
                <strong>{dataset.label}:</strong> {dataset.data.join(', ')}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return renderChartPlaceholder();
};

export default SubChart; 