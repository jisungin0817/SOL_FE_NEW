import React from 'react';
import { SubMapData } from '../../types/chatTypes';
import styles from './SubMap.module.css';

interface SubMapProps {
  data: SubMapData['data'];
}

const SubMap: React.FC<SubMapProps> = ({ data }) => {
  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h3 className={styles.mapTitle}>지도 정보</h3>
        {data.location && (
          <p className={styles.locationText}>{data.location}</p>
        )}
      </div>
      
      <div className={styles.mapContent}>
        {data.coordinates ? (
          <div className={styles.mapPlaceholder}>
            <p>위도: {data.coordinates[0]}</p>
            <p>경도: {data.coordinates[1]}</p>
            <p className={styles.mapNote}>실제 지도는 외부 API 연동 필요</p>
          </div>
        ) : (
          <div className={styles.mapPlaceholder}>
            <p>지도 데이터가 없습니다.</p>
          </div>
        )}
        
        {data.markers && data.markers.length > 0 && (
          <div className={styles.markersList}>
            <h4>마커 목록:</h4>
            {data.markers.map((marker, index) => (
              <div key={index} className={styles.markerItem}>
                <span className={styles.markerTitle}>{marker.title}</span>
                <span className={styles.markerCoords}>
                  ({marker.position[0]}, {marker.position[1]})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubMap; 