import React from "react";
import Character from "./03_Character_STT.json";
import Lottie from "lottie-react";

const CharacterLottie = () => {
  return (
    <div className='overlay'>
      <Lottie animationData={Character} loop={true} />
    </div>
  );
};

export default CharacterLottie;
