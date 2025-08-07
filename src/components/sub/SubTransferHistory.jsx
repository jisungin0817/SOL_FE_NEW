import React from 'react';
import styles from './SubTransferInfo.module.css';
import shinhanLogo from '../../assets/images/shinhan_logo.png';

const SubTransferHistory = ({ data, onAction }) => {
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  // data가 배열인 경우 처리
  const transferData = Array.isArray(data) ? data : [data];

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  };

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className={styles.transferInfoContainer}>
      {transferData.map((transfer, index) => (
        <div key={index} className={styles.transferInfoCard}>
          
          <div className={styles.transferDetails}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>이체일자</div>
              <div className={styles.detailValue}>{formatDate(transfer.transfer_date)}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>입금자명</div>
              <div className={styles.detailValue}>{transfer.input_account_name}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>이체금액</div>
              <div className={`${styles.detailValue} ${styles.amount}`}>
                {formatAmount(transfer.transfer_amt)}원
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTransferHistory; 