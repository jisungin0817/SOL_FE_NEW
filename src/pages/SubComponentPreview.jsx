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
              account_name: "홍길동 자유적금",
              account_number: "11012345678901",
              balance: 5000000
            },
            {
              account_name: "홍길동 정기예금",
              account_number: "11087654321098",
              balance: 10000000
            }
          ]
        }
      ],
      ad_data: {
        text: "총 자산: 15,000,000원<br><br>입출금, 적금, 증권 계좌를 모두 확인할 수 있습니다."
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
    transfer_history: {
      sub_data: [
        {
          type: 'transfer_history',
          data: [
            {
              transfer_date: "20250720",
              input_account_name: "김영희",
              transfer_amt: 500000
            },
            {
              transfer_date: "20250719",
              input_account_name: "박철수",
              transfer_amt: 300000
            },
            {
              transfer_date: "20250718",
              input_account_name: "이영수",
              transfer_amt: 200000
            }
          ]
        }
      ],
      ad_data: {
        text: "이체 내역을 확인할 수 있습니다.<br><br>날짜, 입금자명, 이체금액을 한눈에 볼 수 있습니다."
      }
    },
    auto_transfer_info: {
      sub_data: [
        {
          type: 'auto_transfer_info',
          data: {
            output_account: "11012345678900",
            input_account: "30101234567890",
            transfer_amt: 150000,
            transfer_date: "매월 20일",
            output_account_name: "홍길동",
            input_account_name: "한국전력",
            transfer_period: "2025-02-01 ~ 9999-12-31",
            accept_memo: "전기요금",
            transfer_memo: "자동납부"
          }
        }
      ],
      ad_data: {
        text: "자동이체 정보를 확인할 수 있습니다.<br><br>출금계좌, 입금계좌, 이체금액, 이체일자 등의 정보를 확인하세요."
      }
    },
    transfer_result: {
      sub_data: [
        {
          type: 'transfer_result',
          data: {
            output_account: "11012345678901",
            input_account: "11087654321098",
            transfer_amt: 500000,
            transfer_period: 4500000
          }
        }
      ],
      ad_data: {
        text: "이체 결과를 확인할 수 있습니다.<br><br>출금계좌, 입금계좌, 이체금액, 이체후잔액을 확인하세요."
      }
    },
    table_container: {
      sub_data: [
        {
          type: 'table_container',
          data: [
            //데이터1
            {
              etf_name: "TIGER 고배당", 
              etf_return: "+4.8%",          // 수익률
              etf_volatility: "7.2%",        // 변동성
              etf_total_return: "",      //값이 없을수도 잇으면 총보수
              etf_news_keyword: "ㅇㅇ"
            },
            {
              etf_name: "KODEX 배당성장",
              etf_return: "-2.1%",
              etf_volatility: "12.5%",
              etf_total_return: "",
              etf_news_keyword: "ㅋㅋ"
            },
            {
              etf_name: "KBSTAR ESG",
              etf_return: "+1.3%",
              etf_volatility: "8.9%",
              etf_total_return: "",      //값이 없을수도 잇으면 총보수
              etf_news_keyword: "ㅎㅎ"
            }]
        }
      ],
      ad_data: {
        text: "ETF 정보를 테이블 형태로 확인할 수 있습니다.<br><br>ETF명, 수익률, 변동성, 총보수, 최근뉴스키워드 등을 한눈에 볼 수 있습니다."
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
            className={selectedType === 'chart' ? styles.active : ''} 
            onClick={() => handleTypeChange('chart')}
          >
            Chart
          </button>
          <button 
            className={selectedType === 'transfer_history' ? styles.active : ''} 
            onClick={() => handleTypeChange('transfer_history')}
          >
            Transfer History
          </button>
          <button 
            className={selectedType === 'auto_transfer_info' ? styles.active : ''} 
            onClick={() => handleTypeChange('auto_transfer_info')}
          >
            Auto Transfer Info
          </button>
          <button 
            className={selectedType === 'transfer_result' ? styles.active : ''} 
            onClick={() => handleTypeChange('transfer_result')}
          >
            Transfer Result
          </button>
          <button 
            className={selectedType === 'table_container' ? styles.active : ''} 
            onClick={() => handleTypeChange('table_container')}
          >
            Table Container
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