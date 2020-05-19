(function(){
  var level_content, state, interval, oldProgress, progress, clock;
  const initMistakes = 5;
  const nextLevelthreshold = 10;
  const timePerQuestion = 6000;
  const timeInterval = 20; // for clocl display animation
  const clockInterval =100 / (timePerQuestion / timeInterval) // fro clock display animation


  function init(){
    oldProgress = 0;
    progress = 0;

    state = {
      currentLevel: 1,
      charSet : [],
      currChar: 'f',
      correct:0,
      mistakes:initMistakes,
      timerState : 0,
      points:0,
    }

    level_content = {
      lv1:['f','j'],
      lv2:['d','k'],
      lv3:['l','s'],
      lv4:['a',';'],
      lv5:['u','r'],
      lv6:['i','e'],
      lv7:['w','o'],
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

    startInterval();

    // populate keyboard in HTML file and generate 1D array of all keys
    renderKeyboard();

    state.charSet.push(
      level_content.lv1[0],
      level_content.lv1[1],
    );

    document.getElementById('start-game').innerHTML = 'retry'
    document.getElementById('letter-wrapper').innerHTML = '<div id="next-letter" class="counter">start!</div>'
    document.getElementById('next-letter').innerHTML = `${state.currChar}`
    document.addEventListener('keydown', evaluateKey);
    document.getElementById('currentLevel').innerHTML = `${state.currentLevel}`
    renderStats()
    timer();


  } // end of init()

  function renderKeyboard(){
    var keys = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', 0, '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ]
    for (var row=0; row<keys.length; row++){
      var rowHTML = '';
      for(var key = 0; key < keys[row].length; key++){
        rowHTML = rowHTML + `<div class="key">
                              <p>
                              ${keys[row][key]}
                              </p>
                            </div>`
      }
      document.getElementById('row-'+row).innerHTML=rowHTML
    }

  };

  function startInterval (){
    interval = setInterval(()=>{
      state.timerState <= 100 ? state.timerState += clockInterval : state.timerState=0;
      renderClock()
    },timeInterval)
  }

  function stopInterval(){
    clearInterval(interval);
    state.timerState = 0;
  };

  function renderClock(){
    var letterTag = document.getElementById('letter-wrapper').innerHTML
    var newProgress = state.correct/nextLevelthreshold*100;
    oldProgress < newProgress ? oldProgress++ : '';

    document.getElementById("clock-wrapper").innerHTML = `
          <!-- TIME CLOCK -->
        <svg viewBox="0 0 36 36" id="clock-time" class="clock">
          <path style="  stroke: #F2F2F2";
      fill: none;
      stroke-width: .5;
      stroke-linecap: round;
      animation: progress 1s ease-out"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#444";
            stroke-width="1";
            stroke-dasharray="${state.timerState}, 100"
          />
        </svg>
        <!-- Progress CLOCK -->
        <svg viewBox="0 0 36 36" id="clock-progress" class="clock">
          <path id="path" style=" stroke: #1ECCF4;
      fill: none;
      stroke-width: .2;
      stroke-linecap: round;
      animation: progress 1s ease-out"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#444";
            stroke-width="1";
            stroke-dasharray="0,
              ${100 - oldProgress},
              ${oldProgress} "
          />
        </svg>
  `
  };

  function timer (){
    stopInterval();
    startInterval();
    clock = setTimeout(()=>{
      timer();
      getRandChar();
      wrongAnswer(null);
      renderStats();
    }, timePerQuestion)
  }

  function getRandChar(){
    state.currChar = state.charSet[
      Math.floor( Math.random()*state.charSet.length)
    ]
    document.getElementById('next-letter').innerHTML = `${state.currChar}`
    document.getElementById('next-letter').classList.toggle('transparent')
    setTimeout(()=>{
      document.getElementById('next-letter').classList.toggle('transparent')
    },200)
  }

  function wrongAnswer(e){
    state.mistakes--;
    state.points>1 ? state.points-- : '';
    // highlight red when wrong key
    if(e!=null){
      tag = document.getElementById('next-letter');
      tag.classList.toggle('red');
      tag.innerHTML = e.key;
      setTimeout(()=>{
        tag.classList.toggle('red');
        tag.innerHTML = state.currChar;
        // exit game mode
        state.mistakes >= 1 ? ''  : exitGameMode();
      },150)
    } else {
      state.mistakes >= 1 ? ''  : exitGameMode();
    }
  }

  var fadingKeys = []
  function blinkKey(e){
    var tempChar = e.key;
    var rows = document.getElementById('keyboard').children
    for(var row=0; row<rows.length; row++){

      for(var key=0; key<rows[row].children.length; key++){
        var keyBtn =  rows[row].children[key]
        if(tempChar === keyBtn.children[0].innerHTML.replace(/\s/g, '')){
          keyBtn.classList.toggle('blinkKey');
          (function(){
            var btn = keyBtn;
            setTimeout(()=>{
              btn.classList.remove('blinkKey');
            },500)
          })();
          //console.log(keyBtn.children[0].innerHTML.replace(/\s/g, ''));
        }
      }
    }
  };

  function goodAnswer(){
    state.points++;
    progress++;
    state.correct < nextLevelthreshold ? state.correct++ : levelUp();
  };

  function newLevelReset(){
    oldProgress = 0;
    progress=0;
    state.correct = 0;
    //state.mistakes = initMistakes;
    document.getElementById('currentLevel').innerHTML = `${state.currentLevel}`
  };

  function levelUp(){
    state.mistakes< initMistakes ?  state.mistakes++ : ''
    if (state.currentLevel < Object.keys(level_content).length){
        state.currentLevel++;
        state.charSet.push(
          level_content['lv' + state.currentLevel][0],
          level_content['lv' + state.currentLevel][1],
        )
        newLevelReset();
    }else{
      // you won
      exitGameMode();
    }
  };

  function levelDown(){
    state.currentLevel--;
    // remove characters from upper level from charSet
    state.charSet.length > 2 ? state.charSet = state.charSet.slice(0, state.charSet.length-2) : ''
    if (state.currentLevel >= 1){
      newLevelReset();
    }else{
      // gameover
      stopInterval();
      renderStats()
      exitGameMode();
    }
  };

  function renderStats(){
    // update points:
    document.getElementById('points-counter').innerHTML = state.points + `<span style='font-size:10px'>pt</span>`
    // update keyboard styles
    var myArr = document.getElementsByClassName('key')
    for(var char=0; char<myArr.length; char++){
      var currChar = myArr[char].children[0].innerHTML.replace(/\s/g, '')
       myArr[char].style.border = '1px solid white'; // clear style
       myArr[char].style.backgroundColor = 'var(--lightgray)'; // clear style
       myArr[char].children[0].style.color = 'var(--darkgray)'; // clear style
      for( var index = 0; index<state.charSet.length; index++){
        if( state.charSet[index]===currChar){
          myArr[char].style.border = '1px solid var(--darkgray)';
          myArr[char].style.backgroundColor = 'white';
        }
      }
    }
    // update mistake points color
    mistakes = document.getElementById("mistakes").children
    for(var i = 0; i< mistakes.length; i++){
      i<state.mistakes ? mistakes[i].style.backgroundColor = 'var(--blue)' :
        mistakes[i].style.backgroundColor = 'var(--lightgray)'
    }
  };

  function exitGameMode(){
    console.log('game over');
    console.log(document.getElementById('next-letter').innerHTML);
    stopInterval();
    clearTimeout(clock);
    document.removeEventListener('keydown', evaluateKey);
    document.getElementById('next-letter').innerHTML = 'Game Over';
  };

  function evaluateKey(e){

    if (state.currChar === e.key){
      getRandChar();
      clearTimeout(clock);
      timer();
      goodAnswer();
    }else{
      wrongAnswer(e);
    }
    renderStats();
    blinkKey(e);
  }

  document.getElementById('start').addEventListener('click',init)
  document.getElementById('start-game').addEventListener('click',()=>{
    init();
  })
  renderKeyboard();
})();
