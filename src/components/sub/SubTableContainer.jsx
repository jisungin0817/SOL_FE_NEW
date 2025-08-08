import React from 'react';
import styles from './SubTableContainer.module.css';

const SubTableContainer = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // 모든 데이터를 확인해서 컬럼 구조 파악
  const columns = [
    { key: 'etf_name', label: 'ETF명' },
    { key: 'etf_return', label: '수익률' },
    { key: 'etf_volatility', label: '변동성' }
  ];

  // 선택적 컬럼들 추가 (하나라도 값이 있으면 컬럼 추가)
  const hasTotalReturn = data.some(item => 
    item.etf_total_return !== undefined && 
    item.etf_total_return !== null && 
    item.etf_total_return !== ''
  );
  
  const hasNewsKeyword = data.some(item => 
    item.etf_news_keyword !== undefined && 
    item.etf_news_keyword !== null && 
    item.etf_news_keyword !== ''
  );

  if (hasTotalReturn) {
    columns.push({ key: 'etf_total_return', label: '총보수' });
  }

  if (hasNewsKeyword) {
    columns.push({ key: 'etf_news_keyword', label: '최근뉴스키워드' });
  }

  // 수익률 색상 결정 함수
  const getReturnColor = (returnValue) => {
    if (!returnValue) return 'inherit';
    const value = returnValue.replace(/[+%]/g, '');
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'inherit';
    return numValue >= 0 ? '#00C851' : '#ff4444';
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={styles.tableHeader}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className={styles.tableRow}>
                {columns.map((column, colIndex) => {
                  const value = item[column.key];
                  const isReturnColumn = column.key === 'etf_return';
                  
                  return (
                    <td key={colIndex} className={styles.tableCell}>
                      {isReturnColumn ? (
                        <span 
                          className={styles.returnValue}
                          style={{ color: getReturnColor(value) }}
                        >
                          {value}
                        </span>
                      ) : (
                        <span className={styles.cellValue}>
                          {value || '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubTableContainer;
