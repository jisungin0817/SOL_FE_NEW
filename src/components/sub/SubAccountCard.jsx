import React from 'react';
import styles from './SubAccountCard.module.css';
import shinhanLogo from '../../assets/images/shinhan_logo.png';

const SubAccountCard = ({ data, onAction }) => {
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action.action);
    }
  };

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // data가 배열인 경우 처리
  const accountData = Array.isArray(data) ? data : [data];

  return (
    <div className={styles.accountCardContainer}>
      {accountData.map((account, index) => (
        <div key={index} className={styles.accountCard} onClick={() => handleActionClick(account.action)}>
          <div className={styles.accountHeader}>
                         <div className={styles.bankLogo}>
               <img src={shinhanLogo} alt="신한은행 로고" className={styles.bankLogoImage} />
             </div>
            <div className={styles.accountInfo}>
              <div className={styles.accountName}>{account.account_name}</div>
              <div className={styles.accountNumber}>{account.account_number}</div>
            </div>
          </div>
          
          <div className={styles.accountBalance}>
            <div className={styles.balanceAmount}>
              {formatAmount(account.balance)}원
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubAccountCard; 