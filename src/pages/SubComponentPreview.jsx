import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubDataRenderer from '../components/sub/SubDataRenderer';
import { useTheme } from '../components/ThemeContext';
import { RiCloseLargeLine } from 'react-icons/ri';
import styles from './SubComponentPreview.module.css';

const SubComponentPreview = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [selectedType, setSelectedType] = useState('graph');

  // 각 타입별 샘플 데이터
  const sampleData = {
    graph: [
      {
        type: 'graph',
        data: {
          title: '포트폴리오 구성',
          description: '펀드/ETF는 채권 비중을 높여 구성하는게 좋을 것 같아요.',
          portfolio: {
            fund: 80,
            savings: 20,
            fundLabel: '펀드/ETF',
            savingsLabel: '예적금'
          }
        }
      }
    ],
    account_card: [
      {
        type: 'account_card',
        data: [
          {
            account_name: "신한주거래 우대통장",
            account_number: "110-123-456789",
            balance: "2,500,000"
          },
          {
            account_name: "신한 슈퍼sol 통장",
            account_number: "110-987-654321",
            balance: "5,000,000"
          },
          {
            account_name: "신한 땡겨요페이 통장",
            account_number: "123-456-789",
            balance: "15,000,000"
          }
        ]
      }
    ],
    buttons: [
      {
        type: 'buttons',
        data: [
          { text: '확인', action: 'confirm', value: 'ok' }
        ]
      }
    ],

    chart: [
      {
        type: 'chart',
        data: {
          chartTitle: '수익률 예상',
          chartData: [12, 19, 3, 5, 2],
          description: {
            main: '해당 구성으로 수익률을 예상해보면,',
            sub: '연 4.88%로 약 920만원의 이자가 예상돼요.',
            note: '(시장상황에 따라 변동이 있을 수 있어요.)'
          }
        }
      }
    ],
    card: [
      {
        type: 'card',
        data: [
          {
            product_name: "2025.05.15",
            product_sub_name: "집주인",
            amount: "500,000"
          },
          {
            product_name: "2025.06.15",
            product_sub_name: "집주인",
            amount: "500,000"
          },
          {
            product_name: "2025.07.15",
            product_sub_name: "집주인",
            amount: "500,000"
          }
        ]
      }
    ],
    transfer_info: [
      {
        type: 'transferInfo',
        data: {
          withdraw_account: '신한은행 110-123-456789',
          deposit_account: '신한은행 110-987-654321',
          transfer_amount: '1,000,000',
          transfer_cycle: '1회',
          transfer_period: '2024.12.20',
          receiver_memo: '월세',
          my_memo: '12월 월세',
          action: {
            label: '확인',
            action: 'transfer_confirm'
          }
        }
      }
    ],

  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleAction = (action, value) => {
    console.log('액션 실행:', action, value);
    alert(`액션: ${action}, 값: ${value || '없음'}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    
    <div className={styles.previewPage}>
      <div className={styles.previewHeader}>
        <div className={styles.headerTop}>
          <h1>Sub 컴포넌트 종류</h1>
          <RiCloseLargeLine
            onClick={handleBackToHome}
            className={styles.closeIcon}
            title="닫기"
          />
        </div>
        <div className={styles.previewControls}>
          <button 
            className={selectedType === 'graph' ? styles.active : ''} 
            onClick={() => handleTypeChange('graph')}
          >
            Graph
          </button>
          <button 
            className={selectedType === 'account_card' ? styles.active : ''} 
            onClick={() => handleTypeChange('account_card')}
          >
            Account Card
          </button>
          <button 
            className={selectedType === 'buttons' ? styles.active : ''} 
            onClick={() => handleTypeChange('buttons')}
          >
            Button 1개
          </button>

          <button 
            className={selectedType === 'chart' ? styles.active : ''} 
            onClick={() => handleTypeChange('chart')}
          >
            Chart
          </button>
          <button 
            className={selectedType === 'card' ? styles.active : ''} 
            onClick={() => handleTypeChange('card')}
          >
            Card
          </button>
          <button 
            className={selectedType === 'transfer_info' ? styles.active : ''} 
            onClick={() => handleTypeChange('transfer_info')}
          >
            Transfer Info
          </button>

        </div>
      </div>

      <div className={styles.previewContainer}>
        <div className={styles.componentPreview}>
        <h3 style={{ paddingLeft: '25px' }}>미리보기</h3>
          <div className={styles.componentArea}>
            <SubDataRenderer 
              data={sampleData[selectedType]} 
              onAction={handleAction}
            />
          </div>
        </div>

        <div className={styles.dataPreview}>
          <h3>데이터 구조</h3>
          <div className={styles.jsonViewer}>
            <pre>{JSON.stringify(sampleData[selectedType], null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubComponentPreview; 