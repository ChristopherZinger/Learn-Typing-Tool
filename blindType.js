var level_content, state;
const initMistakes = 5;
const initToNextLevel = 10;

function init(){
  state = {
    currentLevel: 1,
    charSet : [],
    currChar: 'f',
    correct:0,
    mistakes:initMistakes,
  }

  level_content = {
    lv1:['f','j'],
    lv2:['d','k'],
    lv3:['l','s'],
    lv4:['a',';'],
    lv5:['u','r'],
    lv6:['i','e'],
    lv7:['w','i'],
    lv8:['q','p'],
    lv9:['m','v'],
    lv10:['c',','],
    lv11:['x','.'],
    lv12:['z','/'],
    lv13:['h','g'],
    lv14:['t','y'],
    lv15:['n','b'],
    lv16:['8','5'],
    lv17:['4','9'],
    lv18:['3','0'],
    lv19:['7','6'],
    lv20:['1','='],
  };

  state.charSet.push(
    level_content.lv1[0],
    level_content.lv1[1],
  );
  document.getElementById('next-letter').innerHTML = `${state.currChar}`
  updateScore()
  timer();
  document.getElementById('currentLevel').innerHTML = `Level: ${state.currentLevel}`

}

function timer (){
  clock = setTimeout(()=>{
    console.log('time runed out. missed char: ', state.currChar);
    timer();
    wrongAnswer();
    updateScore();
    getRandChar();
  }, 2000)
}

function getRandChar(){
  state.currChar = state.charSet[
    Math.floor( Math.random()*state.charSet.length)
  ]
  document.getElementById('next-letter').innerHTML = `${state.currChar}`
  document.getElementById('next-letter').classList.toggle('transparent')
  setTimeout(()=>{
    document.getElementById('next-letter').classList.toggle('transparent')
  },80)
}

function wrongAnswer(){
  state.mistakes > 1 ? state.mistakes-- : levelDown();
  // highlight red when wrong key
  document.getElementById('next-letter').classList.toggle('red')
  setTimeout(()=>{
    document.getElementById('next-letter').classList.toggle('red')
  },100)
}

function goodAnswer(){
  state.correct < initToNextLevel ? state.correct++ : levelUp();
}

function levelJumpReset(){
  state.correct = 0;
  state.mistakes = initMistakes;
  document.getElementById('currentLevel').innerHTML = `Level: ${state.currentLevel}`
}

function levelUp(){
  if (state.currentLevel < Object.keys(level_content).length){
      state.currentLevel++;
      state.charSet.push(
        level_content['lv' + state.currentLevel][0],
        level_content['lv' + state.currentLevel][1],
      )
      levelJumpReset();
  }else{
    // you won
    exitGameMode();
  }
}

function exitGameMode(){
  clearTimeout(clock);
  document.removeEventListener('keydown', evaluateKey);
}

function levelDown(){
  if (state.currentLevel > 1){
    state.currentLevel--;
  }else{
    // gameover
    exitGameMode();
  }
  levelJumpReset();
}

function updateScore(){
  document.getElementById('mistakesCounter').innerHTML = `Errors left: ${state.mistakes}`
  document.getElementById('correctCounter').innerHTML = `Distance to next level:
  ${initToNextLevel-state.correct}`;
  document.getElementById('keyset').innerHTML = `Keyset: ${state.charSet}`
}

function evaluateKey(e){
  if (state.currChar === e.key){
    getRandChar();
    //console.log('good');
    clearTimeout(clock);
    timer();
    goodAnswer();
  }else{
    wrongAnswer();
  }
  updateScore();
}



var clock, body;
init();

// document.addEventListener('click', ()=>{
//   levelUp();
//   updateScore();
// })




document.addEventListener('keydown', evaluateKey);
