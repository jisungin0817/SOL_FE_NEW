import React, { useEffect, useRef, useState } from "react";
import "regenerator-runtime/runtime";
import styles from "./css/home.module.css";
import { RiCloseLargeLine, RiMenuFill } from "react-icons/ri";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import logo from "../../assets/images/Super_Sol_logo.png";
import CardSliderWithIndicator from "./CardSliderWithIndicator";
import CardSlider from "./CardSlider";

// 테마 설정 함수들 (임시로 직접 구현)
const initSetTheme = (theme, isDarkMode, toggleDarkMode, changeFontSize) => {
  // 테마 초기화 로직
  console.log('Theme initialized:', theme);
};

const initSetFont = (isDarkMode, changeFontSize) => {
  // 폰트 초기화 로직
  console.log('Font initialized');
};
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSeratchParams] = useSearchParams();
  // AI 모드로 변경 - 빈 카드 데이터
  let mainTitle = {
    contents: {
      message: "",
      curation: [],
      multimodal_input: {
        placeholder: "",
        text: "",
        inputvisiable: false
      }
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, fontSize, toggleDarkMode, changeFontSize } = useTheme();



  // 인사말 클릭 이벤트
  const clickCardSliderWithIndicator = async () => {
    // 새로운 채팅 페이지로 이동
    navigate('/chat');
  };

  const clickCardSlider = async (event) => {
    // 새로운 채팅 페이지로 이동
    navigate('/chat');
  };

  //skeleton loading..
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  //init
  useEffect(() => {
    // AI 모드 - 기본 테마 설정
    initSetTheme(
      "default",
      isDarkMode,
      toggleDarkMode,
      changeFontSize,
    );
  }, []);

  useEffect(() => {
    initSetFont(isDarkMode, changeFontSize);
  });

  const goback = () => {
    // 새로운 채팅 페이지로 이동
    navigate('/chat');
  };

  return (
    <div
      className={`${
        isLoading
          ? isDarkMode
            ? `${styles.darkSkeletonContainer}`
            : styles.skeletonContainer
          : isDarkMode
          ? `${styles.darkContainerImage}`
          : styles.container
      }`}
    >
      <div
        className={`${
          isDarkMode
            ? styles.darkContainerColor
            : styles.containerColor
        }`}
      >
        <div className={`${isLoading ? "" : styles.sliderWrap}`}>
          {/* 상단헤더 시작 */}
          <div className={styles.header}>
            {isLoading ? (
              <>
                <span
                  className={`${
                    isDarkMode
                      ? styles.darkSkeletonIcon
                      : styles.skeletonIcon
                  }`}
                />
                <span
                  className={` ${
                    isDarkMode
                      ? styles.darkSkeletonLogo
                      : styles.skeletonLogo
                  }`}
                />
                <span
                  className={`${
                    isDarkMode
                      ? styles.darkSkeletonIcon
                      : styles.skeletonIcon
                  }`}
                />
              </>
            ) : (
              <>
                <RiMenuFill className={styles.icon} />
                <img src={logo} alt='logo' />
                <div className={styles.headerActions}>
                  <button 
                    className={styles.testLink}
                    onClick={() => navigate('/chat')}
                  >
                    채팅 시작
                  </button>
                  <button 
                    className={styles.themeToggle}
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
                  >
                    {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
                  </button>
                  <RiCloseLargeLine
                    onClick={goback}
                    className={styles.icon}
                  />
                </div>
              </>
            )}
          </div>
          <div className={styles.flexcol}>
            <div
              className={`${
                isLoading
                  ? styles.skeletonMainContentWrap
                  : styles.mainContentWrap
              }`}
            >
              <CardSliderWithIndicator
                isLoading={isLoading}
                initScnrInfo={mainTitle}
                clickCardSliderWithIndicator={clickCardSliderWithIndicator}
              />
              <CardSlider
                isLoading={isLoading}
                initScnrInfo={mainTitle}
                clickCardSlider={clickCardSlider}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
