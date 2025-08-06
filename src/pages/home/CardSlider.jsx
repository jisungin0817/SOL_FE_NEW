import React from "react";
import styles from "./css/cardSlider.module.css";
import { useTheme } from "../../components/ThemeContext";
import { ReactComponent as PassbookSvg } from "../../assets/icons/Passbook.svg";
import { ReactComponent as SafeSvg } from "../../assets/icons/safe.svg";
import { ReactComponent as ArrowSvg } from "../../assets/icons/Arrow.svg";

const CardSlider = (props) => {
    const { isLoading, initScnrInfo, clickCardSlider} = props;
    const { isDarkMode, fontSize } = useTheme();

    // const title = [
    //   { title: "예적금 정보", icon: "passbook" },
    //   { title: "IRP 상품 정보", icon: "safe" },
    //   { title: "외식 주식 종목 정보", icon: "arrow" }

    let title = [];
    if(initScnrInfo.hasOwnProperty("contents")){
        // console.log("######################################################################");
        // console.log(initScnrInfo.contents.curation);
        title = initScnrInfo.contents.curation;
    }else {
        title.push("");
        title.push("");
        title.push("");
    }

    const cardIcon = (icon) => {
        switch (icon) {
            case "passbook":
                return <PassbookSvg className={styles.cardIcon} />;

            case "safe":
                return (
                    <SafeSvg
                        className={`${
                            isDarkMode ? styles.safeCardIconDark : styles.safeCardIcon
                        }`}
                    />
                );
            case "arrow":
                return <ArrowSvg className={styles.cardIcon} />;

            default:
                return "";
        }
    };

  return (
      <div className={styles.sliderContainer}>
          <div className={styles.cardSlider}>
              {isLoading ? (
                  <>
                      {Array.from({ length: title.length }).map((_, index) => (
                          <span
                              key={index}
                              className={` ${
                                  isDarkMode ? styles.darkSkeletonCard : styles.skeletonCard
                              }`}
                          />
                      ))}
                  </>
              ) : (
                  <>
                      {title.map((item, index) => (
                          <div
                              key={index}
                              className={`${isDarkMode ? styles.darkCard : styles.card}`}
                              onClick={()=>{
                                  if(item.hasOwnProperty("onClick")){
                                      clickCardSlider(item.onClick);
                                  }
                              }}
                          >
                              <div
                                  className={`${
                                      isDarkMode ? styles.darkCardText : styles.cardText
                                  } ${fontSize === "large" && styles.largeText}`}
                              >
                                  {item.name}
                              </div>
                              {fontSize !== "large" && (
                                    <div className={styles.iconWrap}>{cardIcon(item.icon)}</div>
                              )}
                          </div>
                      ))}
                  </>
              )}
          </div>
      </div>
  );
};

export default CardSlider;
