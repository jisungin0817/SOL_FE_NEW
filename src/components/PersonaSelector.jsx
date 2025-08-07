import React from 'react';
import styles from './PersonaSelector.module.css';
import personImage from '../assets/images/person.png';

const PersonaSelector = ({ onPersonaSelect, onClose }) => {
  const personas = [
    {
      id: 1,
      name: "1번",
      description: "30대 중반, 미혼 직장인 남성",
      user_id: "kim123"
    },
    {
      id: 2,
      name: "2번",
      description: "40대 중반반기혼 여성 개인 사업자",
      user_id: "lee123"
    },
    {
      id: 3,
      name: "3번",
      description: "30대 초반, 미혼 직장인 여성",
      user_id: "park123"
    }
  ];

  const handlePersonaClick = (persona) => {
    onPersonaSelect(persona);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>        
        <div className={styles.content}>
          <div className={styles.personaGrid}>
            {personas.map((persona) => (
              <div
                key={persona.id}
                className={styles.personaCard}
                onClick={() => handlePersonaClick(persona)}
              >
                <div className={styles.personaImage}>
                  <img src={personImage} alt={persona.name} />
                </div>
                <div className={styles.personaInfo}>
                  <h3 className={styles.personaName}>{persona.name}</h3>
                  <p className={styles.personaDescription}>{persona.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector; 