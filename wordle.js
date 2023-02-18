
const darkmode = async() =>{
    var e = document.body;
    e.classList.toggle("dark");
}

const showInfo = async() =>{
    var info = document.getElementById("InfoList");
    var ga = document.getElementById("board");
    var ma = document.getElementById("main");

    if(info.style.display === "flex"){
        info.style.display = "none";
        info.style.borderLeft = "none";
        ga.style.justifyContent = "center";
        ma.style.flexDirection = "column";
        
    }
    else{
        info.style.display = "flex";
        info.style.borderLeft = "2px solid gray";
        ga.style.justifyContent = "space-around";
        ma.style.flexDirection = "row";
    }
}

const selectWord = async () => {
    let {dictionary} = await getWords();
    document.getElementById("reButt").innerHTML = "<strong>Please Wait...</strong>"
    let word = dictionary[Math.floor(Math.random() * dictionary.length)]
    document.getElementById("reButt").innerHTML = "<strong>Start Over</strong>"
    return word
}

const getWords = async() => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {"x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });
    let words = await res.json();
    let {dictionary} = words;
    return {dictionary};
};


currentWord = selectWord();

let guessesRemaining = 4;
let currLetter = 0;

document.addEventListener("keydown", function(event){
    if (guessesRemaining == 0) {
        return;
    }

    let pressedKey = String(event.key)
    if (pressedKey == "Backspace") {
        deleteLetter();
        return;
    }

    if (pressedKey == "Enter") {
        checkGuess();
        return;
    }

    if (pressedKey.match(/^[a-zA-Z]$/)) {
        insertLetter(pressedKey);
        return;
    }

})

const insertLetter = (letter) => {
    let row = document.getElementsByClassName("row")[4 - guessesRemaining];
    let cell = row.getElementsByClassName("cell");

    if (currLetter == 4) {
        return;
    }
    currLetter++;
    letter = letter.toUpperCase();

    cell[currLetter - 1].innerHTML = letter;
    cell[currLetter - 1].style.border = "5px solid #bf9000"
    cell[currLetter].style.border = "5px solid #DFFF00";
    
}


const deleteLetter = () => {
    let row = document.getElementsByClassName("row")[4 - guessesRemaining];
    let cell = row.getElementsByClassName("cell");
    
    if(currLetter == 0){
        return;
    }
    
    cell[currLetter - 1].innerHTML = "";
    currLetter--
    cell[currLetter].style.border = "5px solid #DFFF00"
    cell[currLetter + 1].style.border = "5px solid #bf9000"

}

const checkGuess = async () => {
    if (currLetter !== 4) {
        window.alert("Word is not complete!")
        return
    }

    let row = document.getElementsByClassName("row")[4 - guessesRemaining];
    let cell = row.getElementsByClassName("cell");

    let dictionary = await currentWord
    let word = dictionary['word']
    word = word.toUpperCase()

    let guess = "";

    let count = {}
    for (let i = 0; i < 4; i++) {
        let l = word[i]
        if (count[l]){
            count[l] += 1;
        } 
        else {
            count[l] = 1;
        }
    }

    let exist = {}
    for (let i = 0; i < 4; i++) {
        let l = word[i]
        exist[l] = 0;

    }

    for(let i = 0; i < 4; i++){
        let l = cell[i].innerHTML
        cell[i].style.background = "gray"
        guess += l

        if (l == word[i]) {                
            cell[i].style.background = "#C4E434"
            if (exist[l]) {
                exist[l] += 1;
            }
        
            else{
                exist[l] = 1

            }
        }
    }
    

    for(let i = 0; i < 4; i++){
        let l = cell[i].innerHTML
        if (word.includes(l) && l != word[i]) {
            if(exist[l] < count[l]){
                cell[i].style.background = "#FFBF00"
                exist[l] += 1;
            }
        }
    }

    if (guess == word) {
        document.getElementById("congrats").style.display = "flex"
        document.getElementById("foo").style.display = "flex"
        document.getElementById("board").style.display = "none"
        document.getElementById("foo").style.background = "#93C572"
        document.getElementById("holder").innerHTML = "Congratulations, You Won! Press " + "'<strong> Start Over </strong>'" +" to try again!"
        return
    }

    currLetter = 0
    guessesRemaining--

    if (guessesRemaining == 0) {
        document.getElementById("foo").style.display = "flex"
        document.getElementById("foo").style.background = "#D2042D"
        document.getElementById("holder").innerHTML = "You Failed! The word was " + word + ". Press " + "'<strong> Start Over </strong>'" +" to try again!"
        return
    }

    let nextRow = document.getElementsByClassName("row")[4 - guessesRemaining]
    let nextCell = nextRow.getElementsByClassName("cell")
    nextCell[0].style.border = "5px solid #DFFF00"
}

const getHint = async () => {
    let dictionary = await currentWord
    let hint = dictionary["hint"]
    document.getElementById("foo").style.display = "flex"
    document.getElementById("foo").style.background = "#FFBF00"
    document.getElementById("holder").innerHTML = hint
}

const reset = async () => {
    let {dictionary} = await getWords();
    currentWord = dictionary[Math.floor(Math.random() * dictionary.length)];
    guessesRemaining = 4;
    currLetter = 0;

    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = "";
      cells[i].style.border = "5px solid #bf9000";
      cells[i].style.background = "none";
    }

    let info = document.getElementById("InfoList");
    let ga = document.getElementById("board");
    let ma = document.getElementById("main");
    info.style.display = "none";
    info.style.borderLeft = "none";
    ga.style.justifyContent = "center";
    ma.style.flexDirection = "column";
 
    document.getElementById("congrats").style.display = "none";
    document.getElementById("foo").style.display = "none";
    document.getElementById("holder").innerHTML = "";
    document.getElementById("board").style.display = "flex";
    document.getElementById("one").style.border = "5px solid #DFFF00"

  }
