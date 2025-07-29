import React from 'react';
import { SubDataRendererProps, SubDataType } from '../../types/chatTypes';
import SubMap from './SubMap';
import SubButtons from './SubButtons';
import SubChart from './SubChart';
import SubCard from './SubCard';

const SubDataRenderer: React.FC<SubDataRendererProps> = ({ data, onAction }) => {
  const renderSubComponent = (item: SubDataType, index: number) => {
    switch (item.type) {
      case 'map':
        return <SubMap key={index} data={item.data} />;
      case 'buttons':
        return <SubButtons key={index} data={item.data} onAction={onAction} />;
      case 'chart':
        return <SubChart key={index} data={item.data} />;
      case 'card':
        return <SubCard key={index} data={item.data} onAction={onAction} />;
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