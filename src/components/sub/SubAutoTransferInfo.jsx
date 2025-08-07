import React from 'react';
import styles from './SubTransferInfo.module.css';
import shinhanLogo from '../../assets/images/shinhan_logo.png';

const SubAutoTransferInfo = ({ data, onAction }) => {
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  // data가 객체인 경우 처리
  const transferInfo = data;

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
            <div className={styles.detailValue}>{transferInfo.output_account}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>출금자명</div>
            <div className={styles.detailValue}>{transferInfo.output_account_name}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>입금계좌</div>
            <div className={styles.detailValue}>{transferInfo.input_account}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>입금자명</div>
            <div className={styles.detailValue}>{transferInfo.input_account_name}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>이체금액</div>
            <div className={`${styles.detailValue} ${styles.amount}`}>
              {formatAmount(transferInfo.transfer_amt)}원
            </div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>이체일자</div>
            <div className={styles.detailValue}>{transferInfo.transfer_date}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>이체기간</div>
            <div className={styles.detailValue}>{transferInfo.transfer_period}</div>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.memoSection}>
          <div className={styles.memoRow}>
            <div className={styles.memoLabel}>수취인메모</div>
            <div className={styles.memoValue}>{transferInfo.accept_memo || '-'}</div>
          </div>
          <div className={styles.memoRow}>
            <div className={styles.memoLabel}>이체메모</div>
            <div className={styles.memoValue}>{transferInfo.transfer_memo || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAutoTransferInfo; 