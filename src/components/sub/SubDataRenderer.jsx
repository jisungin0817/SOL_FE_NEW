import React from 'react';
import SubAccountCard from './SubAccountCard';
import SubCard from './SubCard';
import SubChart from './SubChart';
import SubGraph from './SubGraph';
import SubTransferInfo from './SubTransferInfo';

const SubDataRenderer = ({ data, onAction }) => {
  const renderSubComponent = (item, index) => {
    switch (item.type) {
      case 'account_card':
        return <SubAccountCard key={index} data={item.data} onAction={onAction} />;
      case 'card':
        return <SubCard key={index} data={item.data} onAction={onAction} />;
      case 'chart':
        return <SubChart key={index} data={item.data} onAction={onAction} />;
      case 'graph':
        return <SubGraph key={index} data={item.data} onAction={onAction} />;
      case 'transferInfo':
        return <SubTransferInfo key={index} data={item.data} onAction={onAction} />;

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