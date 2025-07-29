
async function typeSentence(sentence, targetRef, delay = 100) {
    // console.log("typeSentence sentence >> ", sentence);
    const letters = sentence.text.split("");
    let i = 0;
    while(i < letters.length) {
        await waitForMs(delay);
        if(targetRef.current.value === undefined){
            targetRef.current.value = letters[i];
        } else {
            targetRef.current.value += letters[i];
        }
        i++;
    }
}

async function deleteSentence(eleRef) {
    const sentence = eleRef.current.value;
    const letters = sentence.split("");
    while(letters.length > 0) {
        await waitForMs(0);
        letters.pop();
        eleRef.current.value = letters.join("");
    }
}

export async function carousel(carouselList, setLoadingRef) {
    console.log("carousel >> ", carouselList)
    var i = 0;
    var ing = true;

    while(ing) {
        // updateFontColor(eleRef, carouselList[i].color)
        await typeSentence(carouselList[i], setLoadingRef);
        await waitForMs(50);
        // await deleteSentence(setLoadingRef);
        // await waitForMs(500);
        i++
        if(i >= carouselList.length) {
            ing = false;
        }
    }
}
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


export async function carouselOne(carouselList, targetRef) {
    // updateFontColor(eleRef, carouselList[i].color)
    await typeSentenceOne(carouselList, targetRef);
    await waitForMs(100);
}

async function typeSentenceOne(sentence, targetRef, delay = 100) {
    // console.log("typeSentence sentence >> ", sentence);
    const letters = sentence.split("");
    let i = 0;
    while(i < letters.length) {
        await waitForMs(delay);
        if(targetRef.current.value === undefined){
            targetRef.current.value = letters[i];
        } else {
            targetRef.current.value += letters[i];
        }
        i++;
    }
}