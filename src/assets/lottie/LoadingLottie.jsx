import React from "react";
import LoadingAnimation from "./Loading_Box.json";
import Lottie from "lottie-react";

const LoadingLottie = () => {
  return (
    <div>
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        className='loadingLottie'
      />
    </div>
  );
};

export default LoadingLottie;
