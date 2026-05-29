const ROWS = 6;
const COLS = 5;
const board = document.getElementById('board');
const input = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('feedback');

// A shorter curated list of 200 common 5-letter words (beginner-friendly)
const words = [
  "about","other","which","their","there","first","could","there","these","would",
  "thing","where","those","after","great","think","three","years","place","sound",
  "still","every","small","found","those","never","under","might","while","house",
  "world","below","asked","going","being","study","group","again","learn","plant",
  "cover","often","watch","today","along","short","right","young","point","carry",
  "plain","voice","paper","store","night","start","story","white","liked","whole",
  "music","river","since","money","class","order","level","black","given","glass",
  "phone","enjoy","field","among","speed","bring","close","trade","ocean","heart",
  "carry","bread","maybe","carry","equal","shown","train","could","built","bread",
  "score","stone","track","light","heavy","human","dance","taste","speak","serve",
  "sleep","smile","carry","paint","drive","thing","enter","leave","sport","value",
  "catch","fight","guide","laugh","begin","chess","books","clean","sharp","ghost",
  "solid","metal","pilot","baker","grail","brave","crown","delay","favor","grade",
  "house","image","japan","kings","lemon","magic","north","ocean","pride","queen",
  "river","stage","teeth","unity","vital","water","xenon","youth","zebra","atlas",
  "blend","cargo","delta","eager","faint","giant","habit","ideal","jolly","kneel",
  "label","march","noble","ocean","piano","quick","rough","sunny","trust","urban",
  "vivid","worry","xylem","yield","zesty","adopt","brush","crane","drove","eager",
  "ferry","gauge","honor","input","juror","knead","laser","mango","naiad","ozone",
  "penny","quest","ranch","shard","tidal","union","vocal","wedge","yacht","zonal",
  "actor","bison","civic","dandy","embed","flute","grace","henry","irony","jewel",
  "karma","lunar","motel","nurse","opera","pepper","quilt","realm","savvy","timid",
  "ultra","vapor","whale","xenon","yummy","zippy","acorn","brisk","cabin","doubt",
  "eagle","focal","giddy","hasty","ivory","jumbo","kayak","linen","mocha","novel",
  "olive","pacer","quark","radar","saver","tango","usher","verge","waltz","yummy",
  "zonal","alert","blink","cheer","dried","epoch","flair","gloss","hoard","inlet",
  "jumbo","knack","lodge","mirth","nylon","olden","patio","quill","risky","sleet",
  "tiger","under","vocal","wager","xenia","yolks","zesty","aisle","brute","cacao",
  "donut","eclat","fancy","glove","homer","inbox","joust","knife","loyal","mason",
  "naval","oaken","pixel","quirk","raven","saber","tempo","unite","vigil","woven"
];

let target = '';
let attempt = 0;

function pickRandomWord(){
  target = words[Math.floor(Math.random()*words.length)].toUpperCase();
}

function createBoard(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('data-row', r);
      cell.setAttribute('data-col', c);
      board.appendChild(cell);
    }
  }
}

function showMessage(msg){
  feedback.textContent = msg;
}

function setCell(row,col,char,cls){
  const index = row*COLS + col;
  const cell = board.children[index];
  cell.textContent = char;
  if(cls) cell.classList.add(cls);
}

function checkGuess(guess){
  guess = guess.toUpperCase();
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const result = Array(COLS).fill('absent');

  // first pass: correct
  for(let i=0;i<COLS;i++){
    if(guessArr[i] === targetArr[i]){
      result[i] = 'correct';
      targetArr[i] = null;
    }
  }
  // second pass: present
  for(let i=0;i<COLS;i++){
    if(result[i] === 'correct') continue;
    const idx = targetArr.indexOf(guessArr[i]);
    if(idx !== -1){
      result[i] = 'present';
      targetArr[idx] = null;
    }
  }

  for(let i=0;i<COLS;i++){
    setCell(attempt,i,guessArr[i], result[i]);
  }

  if(result.every(r=>r==='correct')){
    showMessage('Congratulations! You guessed the word!');
    input.disabled = true;
    submitBtn.disabled = true;
    return true;
  }

  attempt++;
  if(attempt >= ROWS){
    showMessage(`Game over, the word was "${target}"`);
    input.disabled = true;
    submitBtn.disabled = true;
    return false;
  }

  return false;
}

function handleSubmit(){
  const guess = input.value.trim();
  if(guess.length !== 5){
    showMessage('Please enter a 5-letter word');
    return;
  }
  if(attempt >= ROWS) return;
  // display on board
  checkGuess(guess);
  input.value = '';
  input.focus();
}

document.addEventListener('DOMContentLoaded', ()=>{
  createBoard();
  pickRandomWord();
  // remove placeholder text after styling as requested
  feedback.textContent = '';
});

submitBtn.addEventListener('click', handleSubmit);
input.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') handleSubmit();
});
