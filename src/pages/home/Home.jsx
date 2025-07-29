import React, { useEffect, useRef, useState } from "react";
import "regenerator-runtime/runtime";
import styles from "./css/home.module.css";
import { RiCloseLargeLine, RiMenuFill } from "react-icons/ri";
import logo from "../../assets/images/Super_Sol_logo.png";
import CardSliderWithIndicator from "./CardSliderWithIndicator";
import CardSlider from "./CardSlider";
import ChatList from "../../components/chat/ChatList";
import ChatInput from "../../components/chat/ChatInput";
import {
  getBotMsgApi,
  getRandomBotMsg,
  getInitScnrInfoJson,
  initSetTheme,
  initGetThisPageInfo,
  initSetFont,
  getWelcomMessageByScnrCd,
  connectSSE, // 추가
} from "../../utils/commonFunc";
import waait from "waait";
import { useSearchParams } from "react-router-dom";
import {
  initStopwatchRef,
  resetClock,
  startClock,
} from "../../utils/Stopwatch";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useTheme } from "../../components/ThemeContext";
import { useNavigate } from "react-router-dom";

import { getSpeech } from "../../utils/getSpeech";
import { carouselOne } from "../../utils/TypingEffect";

const Home = () => {
  const thisPageName = "NSAH24P-WEBP-04";
  const navigate = useNavigate();
  const [searchParams, setSeratchParams] = useSearchParams();
  const _scnrCd = searchParams.get("scnrCd");
  let _scnrNoNext = useRef(1);
  const _postPage = searchParams.get("postPage");
  const [initScnrInfo, setInitScnrInfo] = useState(
    getInitScnrInfoJson(_scnrCd),
  );
  let mainTitle = initGetThisPageInfo(initScnrInfo, thisPageName);

  //STT
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isRecord, setIsRecord] = useState(false);
  const [sttTimer, setSttTimer] = useState("00:00");
  // if (!browserSupportsSpeechRecognition) {
  //     //음성지원..안되면..
  //     return <span>Browser doesn't support speech recognition.</span>;
  // }

  const [isChatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, fontSize, toggleDarkMode, changeFontSize } = useTheme();
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const isMsgTextingRef = useRef(false);
  const isMsgLoadingRef = useRef(false);
  const chatListDataRef = useRef([]);
  const [chatListData, setChatListData] = useState([]);
  const [mic, setMic] = useState(false); //입력 마이크

  // const [userMsg, setUserMsg] = useState();
  const userInputRef = useRef();

  //sendMsgToBotByComponent 액션에에 따른 발화.. 보일지,말지
  const sendMsgToBotByComponent = (data) => {
    // console.log(data.msg, data.scnrCd);
    if (data.msg === "" && data.scnrCd === "") {
      return;
    }

    const visiable = data.visiable;

    if (visiable) {
      let userMsg = getUserMsg();
      userMsg.msg = data.msg;
      setChatListData((prevChatListData) => [...prevChatListData, userMsg]);
    }

    //여기도 api호출로
    sendMsgToBot(data.msg, data.scnrCd, data.scnrNoNext);
  };

  //메시지 발송
  const handleSendButtonClick = () => {
    if (!isChatOpen) {
      setChatOpen(true);
    }

    //녹음중이면 받아쓰기 한내용 전송.
    if (mic) {
      handleMicClick();
    }

    const msg = userInputRef.current.value;
    //내용 없으면 발화 안함다.
    if (msg.length === 0) {
      return;
    }

    //사용자 발화 멘트 그리기
    sendMsgDraw(msg);
    //사용자 발화 멘트 발송 후 봇 메시지 가져옴
    // console.log("handleSendButtonClick >>>>.", _scnrNoNext.current);

    //여기도 api호출로
    sendMsgToBot(msg, _scnrCd, _scnrNoNext.current);
  };

  //사용자 발화 멘트 발송 후 봇 메시지 가져옴
  const sendMsgToBot = (msg, scnrCd, scnrNoNext) => {
    if (msg && msg.length === 0) return; //내용 없으면 발화 안함다.

    // 기존 방식 (POST)
    // getBotMsgApi(msg, scnrCd, scnrNoNext).then((botMsg) => {
    //   getBotMsg(botMsg);
    // });

    // SSE 방식으로 변경
    // 기존 연결이 있다면 해제 필요(여기선 생략, 필요시 관리)
    connectSSE(scnrCd, scnrNoNext, (botMsg) => {
      // botMsg가 배열이 아닐 수도 있으니 배열로 변환
      const botMsgArr = Array.isArray(botMsg) ? botMsg : [botMsg];
      getBotMsg(botMsgArr);
    }, () => {
      // SSE 연결 완료 후 정리
      console.log('[SSE] 연결 완료');
    });
  };

  //사용자 발화 멘트
  const sendMsgDraw = (msg) => {
    setChatListData((prevChatListData) => [
      ...prevChatListData,
      getUserMsg(msg),
    ]);
  };

  //사용자 메세지
  const getUserMsg = (msg) => {
    return {
      speaker: "user",
      msg: msg,
    };
  };

  //사용자 발화의 답변 받은 데이터 처리
  const getBotMsg = async (botMsg) => {
    for (let i = 0; i < botMsg.length; i++) {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", botMsg[i]);
      // console.log(botMsg[i]);
      // await waait(2000);
      //botMsg를 파싱해서 component 에서 쓰이는 형태로 데이터를 전달
      const convertMsg = await convertBotMsg(botMsg[i]);
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      // console.log(convertMsg.scnrNo);
      // console.log(convertMsg.scnrNoNext);

      //봇 답변 잘 못알아들었을때 _scnrNoNext.current
      if (convertMsg.scnrNo < 0) {
        // console.log("유지");
      } else {
        // console.log("증가");
        _scnrNoNext.current = convertMsg.scnrNoNext;
      }
      // console.log("_scnrNoNext.current >>>>>>>>>>>", _scnrNoNext.current);

      // alert(convertMsg.scnrNo);
      // console.log("convertMsg >> ", convertMsg);
      setChatListData((prevChatListData) => [...prevChatListData, convertMsg]);

      //로딩 중 이면 로딩 스테이터스
      if (convertMsg.type === "loading") {
        isMsgLoadingRef.current = true;
        if (await waitForLoading(isMsgLoadingRef)) {
          //로딩 봇 메세지 지움
          setChatListData((preChatListData) => [
            ...preChatListData.slice(0, preChatListData.length - 1),
          ]);
        }
      } else {
        isMsgTextingRef.current = true;
        await waitForLoading(isMsgTextingRef);
      }
    }
  };

  const waitForLoading = async (ref) => {
    // console.log("waitForLoading chatListData >>>>>>>>>>>>>>>>>", chatListData);
    // console.log("isMsgLoadingRef", isMsgLoadingRef);
    while (ref.current) {
      // console.log("IsMsgLoading... 1000ms..");
      await waait(500);
    }
    return true;
  };

  const convertBotMsg = async (botMsg) => {
    let covertMsg = {};

    // console.log("botMsg > ", botMsg);
    const type = botMsg.type;
    covertMsg = convertBotMsgAnswer(botMsg, type);

    // switch(type){
    //     case "answer" :
    //         covertMsg = convertBotMsgAnswer(botMsg, type);
    //         break;
    //     case "loading" :
    //         covertMsg = convertBotMsgLoading(botMsg, type)
    //         break;
    // }

    // processBotMsg;
    return covertMsg;
  };

  const convertBotMsgAnswer = async (botMsg, type) => {
    // console.log("convertBotMsgAnswer botMsg > ", botMsg);
    // console.log("convertBotMsgAnswer main_answer > ", botMsg.main_answer);
    // console.log("convertBotMsgAnswer sub_data > ", botMsg.sub_data);
    // console.log("convertBotMsgAnswer ad_data > ", botMsg.ad_data);
    // console.log("convertBotMsgAnswer speaker > ", botMsg.speaker);
    const mainAnswer = botMsg.main_answer;
    const subData = botMsg.sub_data;
    const adData = botMsg.ad_data;
    const speaker = botMsg.speaker;
    const scnrNo = botMsg.scnr_no;
    const scnrNoNext = botMsg.scnr_no_next;

    return {
      mainAnswer: await getRandomBotMsg(mainAnswer, type),
      subData: subData,
      adData: adData,
      speaker: speaker,
      type: type,
      scnrNo: scnrNo,
      scnrNoNext: scnrNoNext,
    };
  };

  //STT 음성입력 start
  const startListening = () => {
    const option = { continuous: true };
    SpeechRecognition.startListening(option);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleMicClick = () => {
    if (mic) {
      //듣는 중 이면 녹음 정지
      stopListening();
      userInputRef.current.value += transcript;
      // setInputSendMsg(transcript);
      // 안녕하세요 안녕하세요 계좌 정보 좀 주세요
      resetTranscript();
      resetClock(setSttTimer);
      setMic(false);
    } else {
      //대기 중 이면 녹음 시작
      resetTranscript();
      startListening();
      initStopwatchRef(setSttTimer);
      startClock();
      setMic(true);
    }
  };

  const handleMicReset = () => {
    setMic(false);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setChatListData([]);
    _scnrNoNext.current = 1;
  };

  // 인사말 클릭 이벤트
  const clickCardSliderWithIndicator = async () => {
    // console.log("clickCardSliderWithIndicator >>>>>>>>>>>>>>>>>>>>>>>>>>");
    // console.log("mainTitle > ", mainTitle);
    // console.log("mainTitle.contents > ", mainTitle.contents);

    if (
      mainTitle.hasOwnProperty("contents") &&
      mainTitle.contents.hasOwnProperty("multimodal_input")
    ) {
      const multimodalInput = mainTitle.contents.multimodal_input;
      if (multimodalInput !== undefined) {
        const text = multimodalInput.hasOwnProperty("text")
          ? multimodalInput.text
          : "";

        if (text === "") {
          return;
        }

        // console.log(text);
        if (
          multimodalInput.inputvisiable !== undefined &&
          multimodalInput.inputvisiable
        ) {
          //메시지 타이입 따따따따따 타이핑
          await carouselOne(text, userInputRef);
          await sendMsgDraw(text); //사용자 발화 메시지 그림
        }

        //창 열고
        if (!isChatOpen) {
          setChatOpen(true);
        }
        //메시지 보내고
        await sendMsgToBot(text, _scnrCd, _scnrNoNext.current);
      }
    }
  };

  const clickCardSlider = async (event) => {
    let msg = event.msg;
    msg = event.msgVisible ? msg : "";

    //사용자 발화 메시지 그림 아래 주석 해제하면 사용자 발화 메시지 보임
    if (msg !== "") {
      await sendMsgDraw(msg);
    }

    //창 열고
    if (!isChatOpen) {
      setChatOpen(true);
    }
    //메시지 보내고
    await sendMsgToBot(msg, _scnrCd, _scnrNoNext.current);
  };

  //skeleton loading..
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
    //테스트 시나리오 id로 정보 가져오기
  }, []);

  //init
  useEffect(() => {
    getSpeech("");
    initSetTheme(
      initScnrInfo.theme,
      isDarkMode,
      toggleDarkMode,
      changeFontSize,
    );
    // initSetFont(isDarkMode, changeFontSize);

    //스타트 위치 AI_HOME 또는 MULTIMODAL
    // console.log("_postPage >>", _postPage);
    if (_postPage === "NSAH24P-WEBP-06") {
      const timer = setTimeout(() => {
        //챗봇이 먼저 말을 하는 케이스 처리
        //1. 텍스트 따따딲 입력
        const text = getWelcomMessageByScnrCd(_scnrCd);
        carouselOne(text, userInputRef).then(() => {
          //메시지 발화
          if (text !== "") sendMsgDraw(text); //사용자 발화 메시지 그림
          //입력창 온
          setChatOpen(true);
          //메시지 보내고
          // console.log("//메시지 보내고", _scnrNoNext);
          sendMsgToBot(text, _scnrCd, _scnrNoNext.current);
        });
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      //todo anything..
    }

    // window.speechSynthesis.getVoices();
  }, []);
  useEffect(() => {
    initSetFont(isDarkMode, changeFontSize);
  });

  //chatListData 챗봇 대화 re_rendering 및 정리
  useEffect(() => {
    //화면의 사용자 메시지 렌더링 후 입력 메시지 삭제
    if (userInputRef.current) {
      userInputRef.current.value = "";
    }
    handleMicReset();
  }, [chatListData]);

  const goback = () => {
    navigate(-1);
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
            ? `${
                isChatOpen ? styles.darkBackground : styles.darkContainerColor
              }`
            : `${isChatOpen ? styles.lightBackground : styles.containerColor}`
        }`}
      >
        <div className={`${isLoading ? "" : styles.sliderWrap}`}>
          {/* ...기존 코드 생략... */}
        </div>
        {/* ...기존 코드 생략... */}
      </div>
    </div>
  );
};

export default Home;