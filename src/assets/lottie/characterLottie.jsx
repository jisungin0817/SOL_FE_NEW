import React from "react";
import charectorAnimation from "./characterSTT.json";
import Lottie from "lottie-react";

const CharacterLottie = () => {
  return (
    <div>
      <Lottie
        animationData={charectorAnimation}
        loop={true}
        className='lottie'
      />
    </div>
  );
};

export default CharacterLottie;
