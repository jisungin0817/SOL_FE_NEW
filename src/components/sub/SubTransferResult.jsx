import React from 'react';
import styles from './SubTransferInfo.module.css';
import shinhanLogo from '../../assets/images/shinhan_logo.png';

const SubTransferResult = ({ data, onAction }) => {
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  // data가 객체인 경우 처리
  const transferResult = data;

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className={styles.transferInfoContainer}>
      <div className={styles.transferInfoCard}>
        
        <div className={styles.transferDetails}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>출금계좌</div>
            <div className={styles.detailValue}>{transferResult.output_account}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>입금계좌</div>
            <div className={styles.detailValue}>{transferResult.input_account}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>이체금액</div>
            <div className={`${styles.detailValue} ${styles.amount}`}>
              {formatAmount(transferResult.transfer_amt)}원
            </div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>이체수수료</div>
            <div className={styles.detailValue}>{formatAmount(transferResult.transfer_period)}원</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubTransferResult; 