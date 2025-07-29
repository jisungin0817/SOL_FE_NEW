import React, {useContext, useRef, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {initStopwatchRef, resetClock, startClock} from "./Stopwatch";
import {
    botMsgDrawing,
    botMsgDrawingAnswer,
    botMsgDrawingLoading,
    getBotMsgApi,
    getRandomBotMsg,
    userMsgDrawing
} from "../CommonFunc";
import {getSpeech} from "./getSpeech";
import waait from "waait";
import {carousel} from "./TypingEffect";
import async from "async";

import { ScnrInfoContext } from "./context";


const Dictaphone = (prop) => {

    // const scnrInfoContext = useContext(ScnrInfoContext);


    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [isRecord, setIsRecord ] = useState(false);
    // const sttTimerRef = useRef();
    const [sttTimer, setSttTimer] = useState("00:00");
    // const [inputSendMsg, setInputSendMsg] = useState("");
    const userMsgInputRef = useRef();


    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    function _startListening () {
        const option = { continuous: true };
        SpeechRecognition.startListening(option);
    }

    function _stopListening () {
        SpeechRecognition.stopListening();
    }

    function _onKeyDown(e) {
        // console.log(e.target);
    }

    // async function _msgDraw(botMsg) {
    //     for (let i = 0; i <botMsg.length ; i++) {
    //         console.log("i > ", i);
    //         const answerType = botMsg[i].type;
    //         if(answerType === "answer"){
    //             await botMsgDrawingAnswer(botMsg[i], prop.textareaRef);
    //         } else if(answerType === "loading"){
    //             // console.log("while");
    //             await botMsgDrawingLoading(botMsg[i], prop.loadingRef);
    //         }
    //     }
    // }

    async function _sendMsg() {
        // alert(userMsgInputRef.current.value);
        const msg= userMsgInputRef.current.value || "사천만";
        const scnrId = 5;
        let returnData = null;
        await getBotMsgApi(msg, scnrId)
            .then(botMsg => {
                // console.log(r)
                userMsgDrawing(msg, prop.textareaRef);
                userMsgInputRef.current.value = "";
                // botMsgDrawing(botMsg, prop.textareaRef, prop.setLoadingRef)
                _msgDraw(botMsg);
                returnData = botMsg;
            });

        // console.log(returnData);
        // _msgDraw(returnData);
    }

    return (
        <div>
            <label>{scnrInfoContext["test1"].name}</label>
            <p>녹음여부: {listening ? 'on' : 'off'}</p>
            {/*<button onClick={_startListening}>Start</button>*/}
            {/*<button onClick={_stopListening}>Stop</button>*/}
            {/*<button onClick={resetTranscript}>Reset</button>*/}
            {/*<p>{transcript}</p>*/}

            <input onKeyDown={_onKeyDown} ref={userMsgInputRef}/>
            <button onClick={_sendMsg}>발송</button>
            <br/>
            {/*transcript : <input  value={transcript}/><br/>*/}
            <button
                onClick={ () => {
                    if(isRecord) {
                        //듣는 중 이면 녹음 정지
                        _stopListening();
                        userMsgInputRef.current.value += transcript;
                        // setInputSendMsg(transcript);
                        // 안녕하세요 안녕하세요 계좌 정보 좀 주세요
                        resetTranscript();
                        resetClock(setSttTimer);
                    } else {
                        //대기 중 이면 녹음 시작
                        resetTranscript();
                        _startListening();
                        initStopwatchRef(setSttTimer);
                        startClock();
                    }

                    setIsRecord(!isRecord);
                }}
            >
                { (isRecord) ? '듣는 중' : '음성입력 대기' }
            </button>

            <br/>

            <label>{sttTimer}</label>
        </div>
    );
};
export default Dictaphone;