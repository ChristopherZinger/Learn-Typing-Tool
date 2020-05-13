(function(){
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

    // populate keyboard in HTML file
    (function(){
      var keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', 0, '-', '='],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
      ]
      for (var row=0; row<keys.length; row++){
        var rowHTML = '';
        console.log();
        for(var key = 0; key < keys[row].length; key++){
          rowHTML = rowHTML + `<div class="key">${keys[row][key]}</div>`
        }
        document.getElementById('row-'+row).innerHTML=rowHTML
      }
    })();

    state.charSet.push(
      level_content.lv1[0],
      level_content.lv1[1],
    );
    document.getElementById('next-letter').innerHTML = `${state.currChar}`
    updateScore()
    timer();
    document.getElementById('currentLevel').innerHTML = `${state.currentLevel}`

  }

  function timer (){
    clock = setTimeout(()=>{
      timer();
      wrongAnswer(null);
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

  function wrongAnswer(e){
    state.mistakes > 1 ? state.mistakes-- : levelDown();
    // highlight red when wrong key
    if(e!=null){
      tag = document.getElementById('next-letter');
      tag.classList.toggle('red');
      tag.innerHTML = e.key;
      setTimeout(()=>{
        tag.classList.toggle('red');
        tag.innerHTML = state.currChar;
      },100)
    }
  }

  function goodAnswer(){
    state.correct < initToNextLevel ? state.correct++ : levelUp();
  }

  function newLevelReset(){
    state.correct = 0;
    state.mistakes = initMistakes;
    document.getElementById('currentLevel').innerHTML = `${state.currentLevel}`
  }

  function levelUp(){
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
  }

  function levelDown(){
    if (state.currentLevel > 1){
      state.currentLevel--;
    }else{
      // gameover
      exitGameMode();
    }
    newLevelReset();
  }

  function updateScore(){
    document.getElementById('mistakesCounter').innerHTML = `Errors left: ${state.mistakes}`
    document.getElementById('correctCounter').innerHTML = `Distance to next level:
    ${initToNextLevel-state.correct}`;
    document.getElementById('keyset').innerHTML = `Keyset: ${state.charSet}`
  }

  function exitGameMode(){
    clearTimeout(clock);
    document.removeEventListener('keydown', evaluateKey);
  }

  function evaluateKey(e){
    if (state.currChar === e.key){
      getRandChar();
      //console.log('good');
      clearTimeout(clock);
      timer();
      goodAnswer();
    }else{
      wrongAnswer(e);
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


})();
