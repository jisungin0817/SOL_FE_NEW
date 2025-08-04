import React, {useEffect, useRef, useState} from "react";
import styles from "./css/chatList.module.css";
import {RiCloseLargeLine, RiMicLine} from "react-icons/ri";
import { useTheme } from "../ThemeContext";
import AIChatBox from "./AIChatBox";
import UserChatBox from "./UserChatBox";
import {getSpeech} from "../../utils/getSpeech";
import AIChatBoxLoading from "./AIChatBoxLoading";

const ChatListNew = (props) => {
    const isPageNew = true;
    const thisPageName = "NSAH24P-WEBP-06";

    const {isOpen, onClose, data, setData, handleIsMsgLoading, isMsgLoadingRef, isMsgTextingRef, sendMsgToBotByComponent} = props;
    const [showCard, setShowCard] = useState(false);
    const scrollEndRef = useRef();
    const scrollTopRef = useRef();
    const timer = useRef(undefined);

    const { isDarkMode, fontSize } = useTheme();

    const scrollToBottom = () => {
        const currentScrollRef = scrollEndRef.current;
        if (currentScrollRef) {
            currentScrollRef.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    const scrollToTop = () => {
        const currentScrollRef = scrollTopRef.current;
        if (currentScrollRef) {
            currentScrollRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    //chatListData 챗봇 대화 re_rendering 및 정리
    useEffect(() => {
        // 채팅창이 처음 열릴 때만 스크롤을 맨 위로
        if (isOpen && data.length === 1) {
            scrollToTop();
        }
        // 새로운 메시지가 추가되면 스크롤을 맨 아래로
        if (isOpen && data.length > 1) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [data, isOpen]);
    
    const selectAIChatBox = (item, index) => {
        console.log("ChatListNew - selectAIChatBox item:", item);
        console.log("ChatListNew - selectAIChatBox item.type:", item.type);

        if(item.speaker === "user" || item.type === "user_message"){
            console.log("ChatListNew - UserChatBox 렌더링");
            return <UserChatBox
                        index={index}
                        msg={item.main_answer && item.main_answer[0] ? item.main_answer[0].text : item.msg || ""}
                        scrollToBottom={scrollToBottom}
            />
        } else if(item.type === "answer" || item.type === "loading"){
            console.log("ChatListNew - AIChatBox 렌더링");
            return <AIChatBox
                        index={index}
                        msg={item}
                        playVoice={getSpeech}
                        handleIsMsgLoading={handleIsMsgLoading}
                        data={data}
                        setData={setData}
                        isMsgLoadingRef={isMsgTextingRef}
                        scrollToBottom={scrollToBottom}
                        sendMsgToBotByComponent={sendMsgToBotByComponent}
                        isPageNew={isPageNew}
            />
        } else if(item.type === "api_response"){
            console.log("ChatListNew - API Response 렌더링");
            return (
                <div style={{
                    color: 'white',
                    fontSize: '16px',
                    paddingLeft: '10px',
                    marginTop: '-5px',
                    marginBottom: '10px'
                }}>
                    {item.main_answer && item.main_answer[0] ? item.main_answer[0].text : ""}
                </div>
            );
        } else {
            console.log("ChatListNew - AIChatBoxLoading 렌더링");
            //로딩을 나눠야 하나??
            return <AIChatBoxLoading
                        index={index}
                        msg={item}
                        playVoice={getSpeech}
                        handleIsMsgLoading={handleIsMsgLoading}
                        data={data}
                        setData={setData}
                        isMsgLoadingRef={isMsgLoadingRef}
                        scrollToBottom={scrollToBottom}
                        isPageNew={isPageNew}
            />
        }
    }

    //순서 지켜야 함 1
    if (!isOpen) {
        return (
            <div className={`${styles.container} ${isOpen ? styles.open : ""}`}></div>
        );
    }else{
        //챗봇 대화가 시작하면 스크롤 다운 인터벌 시작
        if(timer.current === undefined){
            timer.current = setInterval(() => {
                // console.log("챗봇리스트 스크롤 하단 밖");
                if(isMsgLoadingRef.current || isMsgTextingRef.current){
                    // console.log("챗봇리스트 스크롤 하단 안");
                    // scrollToBottom();
                }
            }, 1000);
        }
    }


    //순서 지켜야 함 2
    return (
        <div
            className={`${isDarkMode ? styles.darkContainer : styles.container} ${
                isOpen ? styles.open : ""
            }`}
        >
            {/* Close button */}
            <div className={styles.header}>
                <button
                    onClick={()=>{
                        clearInterval(timer.current);
                        timer.current = undefined;
                        onClose();
                    }
                }>
                    <RiCloseLargeLine
                        className={`${isDarkMode ? styles.darkIcon : styles.icon}`}
                    />
                </button>
            </div>

            {/* 채팅 리스트 내용 */}
            <div key={"ChatListNew"} className={styles.chatContainer} >

                            {/* 직접 selectAIChatBox 사용 */}
            {(() => {
                console.log("ChatListNew - data:", data);
                console.log("ChatListNew - data.length:", data.length);
                return data.length > 0 && data.map((item, index) => {
                    console.log("ChatListNew - map item:", item, "index:", index);
                    return (
                        <React.Fragment key={index}>
                            {selectAIChatBox(item, index)}
                        </React.Fragment>
                    );
                });
            })()}
                
                {/* 스크롤 */}
                <div ref={scrollEndRef}> </div>
            </div>
            

        </div>
    );
};

export default ChatListNew;
