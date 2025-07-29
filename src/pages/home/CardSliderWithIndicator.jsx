import React, { useState, useRef, useEffect } from "react";
import styles from "./css/cardSliderWithIndicator.module.css";
import { ReactTyped } from "react-typed";
import { useTheme } from "../../components/ThemeContext";

const CardSliderWithIndicator = (props) => {
  const { isLoading, initScnrInfo, clickCardSliderWithIndicator } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardContainerRef = useRef(null);

  const { isDarkMode, fontSize } = useTheme();
  // const data = initScnrInfo.message;
  // console.log("######################################################################");
  // console.log(initScnrInfo);
  // console.log(initScnrInfo.contents.message === "");
  // console.log("!!!!!!!!!!!!!!!");

  const data = useRef([]);
  let msg = "";
  if(initScnrInfo.hasOwnProperty("contents")){
    msg = initScnrInfo.contents.message;
    msg = msg == null ? "" : msg ;
  }
  data.current.push(msg);

  const handleScroll = () => {
    if (cardContainerRef.current) {
      const scrollLeft = cardContainerRef.current.scrollLeft;
      const width = cardContainerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const container = cardContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
      <div className={styles.sliderContainer}>
        <div className={styles.cardSlider} ref={cardContainerRef}>
          {isLoading ? (
              <div
                  className={` ${
                      isDarkMode ? styles.darkSkeletonCard : styles.skeletonCard
                  }`}
              ></div>
          ) : (
              <>
                {data.current.map((item, index) => (
                    <div
                        key={index}
                        className={`${isDarkMode ? styles.darkCard : styles.card}`}
                        onClick={clickCardSliderWithIndicator}
                    >
                      <ReactTyped
                          showCursor={false}
                          typeSpeed={40}
                          strings={[item]}
                          className={`${styles.cardText} ${
                              isDarkMode && styles.darkCardText
                          } ${fontSize === "large" && styles.textLarger}`}
                      />
                    </div>
                ))}
              </>
          )}
        </div>

        <div className={styles.indicatorContainer}>
          {isLoading ? (
              <>
                {Array.from({ length: data.length }).map((_, index) => (
                    <div
                        key={index}
                        className={`${currentIndex === index ? styles.skeleton : ""} ${
                            isDarkMode ? styles.darkIndicator : styles.indicator
                        }`}
                    />
                ))}
              </>
          ) : (
              <>
                {Array.from({ length: data.length }).map((_, index) => (
                    <div
                        key={index}
                        className={` ${
                            isDarkMode ? styles.darkIndicator : styles.indicator
                        } ${currentIndex === index ? styles.active : ""}`}
                    />
                ))}
              </>
          )}
        </div>
      </div>
  );
};

export default CardSliderWithIndicator;
