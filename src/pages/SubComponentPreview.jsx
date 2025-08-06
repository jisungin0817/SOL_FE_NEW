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
    graph: {
      sub_data: [
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
      ad_data: {
        text: "위 포트폴리오는 안정성을 고려한 구성입니다.<br><br>펀드/ETF 80%, 예적금 20% 비율로 분산 투자하여 리스크를 최소화했습니다."
      }
    },
    account_card: {
      sub_data: [
        {
          type: 'account_card',
          data: [
            {
              account_name: "신한은행",
              account_number: "110-123-456789",
              account_type: "입출금",
              balance: "2,500,000",
              currency: "KRW",
              status: "정상",
              action: {
                label: "상세보기",
                action: "account_detail"
              }
            },
            {
              account_name: "신한은행",
              account_number: "110-987-654321",
              account_type: "적금",
              balance: "5,000,000",
              currency: "KRW",
              status: "정상",
              action: {
                label: "상세보기",
                action: "account_detail"
              }
            },
            {
              account_name: "신한증권",
              account_number: "123-456-789",
              account_type: "증권",
              balance: "15,000,000",
              currency: "KRW",
              status: "정상",
              action: {
                label: "상세보기",
                action: "account_detail"
              }
            }
          ]
        }
      ],
      ad_data: {
        text: "총 자산: 22,500,000원<br><br>입출금, 적금, 증권 계좌를 모두 확인할 수 있습니다."
      }
    },
    buttons: {
      sub_data: [
        {
          type: 'buttons',
          data: [
            { text: '확인', action: 'confirm', value: 'ok' }
          ]
        }
      ],
      ad_data: {
        text: "버튼을 클릭하면 해당 액션이 실행됩니다."
      }
    },
    chart: {
      sub_data: [
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
      ad_data: {
        text: "차트는 시각적으로 수익률을 보여줍니다.<br><br>예상 수익률은 참고용이며, 실제 수익률과는 차이가 있을 수 있습니다."
      }
    },
    card: {
      sub_data: [
        {
          type: 'card',
          data: [
            {
              product_name: "신한카드",
              product_sub_name: "플래티넘",
              amount: "500,000"
            },
            {
              product_name: "신한카드",
              product_sub_name: "골드",
              amount: "300,000"
            }
          ]
        }
      ],
      ad_data: {
        text: "추천 상품들을 카드 형태로 보여줍니다.<br><br>각 카드를 클릭하면 상세 정보를 확인할 수 있습니다."
      }
    },
    transfer_info: {
      sub_data: [
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
      ad_data: {
        text: "이체 정보를 확인하고 승인할 수 있습니다.<br><br>모든 정보가 정확한지 확인 후 진행하세요."
      }
    }
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
              data={sampleData[selectedType].sub_data} 
              onAction={handleAction}
            />
            
            {/* ad_data 표시 */}
            {sampleData[selectedType].ad_data && sampleData[selectedType].ad_data.text && (
              <div style={{
                color: 'white',
                fontSize: '14px',
                paddingLeft: '10px',
                marginTop: '10px',
                marginBottom: '10px',
                lineHeight: '1.5'
              }}>
                <div dangerouslySetInnerHTML={{ __html: sampleData[selectedType].ad_data.text }} />
              </div>
            )}
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