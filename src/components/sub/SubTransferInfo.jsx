import React from 'react';
import styles from './SubTransferInfo.module.css';
import shinhanLogo from '../../assets/images/shinhan_logo.png';

const SubTransferInfo = ({ data, onAction }) => {
  const transferData = Array.isArray(data) ? data : [data];

  return (
    <div className={styles.transferInfoContainer}>
      {transferData.map((transfer, index) => (
        <div key={index} className={styles.transferInfoCard}>
          
          <div className={styles.transferDetails}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>출금계좌</div>
              <div className={styles.detailValue}>{transfer.withdraw_account}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>입금계좌</div>
              <div className={styles.detailValue}>{transfer.deposit_account}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>이체금액</div>
              <div className={`${styles.detailValue} ${styles.amount}`}>
                {transfer.transfer_amount}원
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>이체주기</div>
              <div className={styles.detailValue}>{transfer.transfer_cycle}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>이체기간</div>
              <div className={styles.detailValue}>{transfer.transfer_period}</div>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.memoSection}>
            <div className={styles.memoRow}>
              <div className={styles.memoLabel}>받는분메모</div>
              <div className={styles.memoValue}>{transfer.receiver_memo || '-'}</div>
            </div>
            <div className={styles.memoRow}>
              <div className={styles.memoLabel}>내통장메모</div>
              <div className={styles.memoValue}>{transfer.my_memo || '-'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTransferInfo; 