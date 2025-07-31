import React from 'react';
import SubButtons from './SubButtons';
import SubChart from './SubChart';
import SubCard from './SubCard';
import SubChat from './SubChat';
import SubAccountCard from './SubAccountCard';
import SubPortfolioChart from './SubPortfolioChart';

const SubDataRenderer = ({ data, onAction }) => {
  const renderSubComponent = (item, index) => {
    switch (item.type) {
      case 'chat':
        return <SubChat key={index} data={item.data} onAction={onAction} />;
      case 'buttons':
        return <SubButtons key={index} data={item.data} onAction={onAction} />;
      case 'chart':
        return <SubChart key={index} data={item.data} />;
      case 'card':
        return <SubCard key={index} data={item.data} onAction={onAction} />;
      case 'account_card':
        return <SubAccountCard key={index} data={item.data} onAction={onAction} />;
      case 'graph':
        return <SubPortfolioChart key={index} data={item.data} onAction={onAction} />;
      default:
        return <div key={index}>지원하지 않는 컴포넌트 타입입니다.</div>;
    }
  };

  return (
    <div>
      {data.map((item, index) => renderSubComponent(item, index))}
    </div>
  );
};

export default SubDataRenderer; 