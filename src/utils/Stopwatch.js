let timerId;
let time = 0;
let stopwatch = null;
let  hour, min, sec;

export function initStopwatchRef(setSttTimer) {
    stopwatch = setSttTimer;
}

function printTime() {
    time++;
    // stopwatch.innerText = getTimeFormatString();
    // console.log(stopwatch.text);
    stopwatch(getTimeFormatString());
}

//시계 시작 - 재귀호출로 반복실행
export function startClock() {
    printTime();
    stopClock();
    timerId = setTimeout(startClock, 1000);
}

//시계 중지
function stopClock() {
    if (timerId != null) {
        clearTimeout(timerId);
    }
}

// 시계 초기화
export function resetClock(setSttTimer) {
    stopClock()
    // stopwatch.innerText = "00:00:00";
    // stopwatch.current.text = "00:00";
    // stopwatch.text = "00:00";
    setSttTimer("00:00");
    time = 0;
}

// 시간(int)을 시, 분, 초 문자열로 변환
function getTimeFormatString() {
    hour = parseInt(String(time / (60 * 60)));
    min = parseInt(String((time - (hour * 60 * 60)) / 60));
    sec = time % 60;

    // return String(hour).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
    return String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}