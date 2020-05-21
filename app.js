{
  // Game State Manager
  const gameMgr = (()=>{
    let state;
    const level_content = {
      lvl1:['f','j'],
      lvl2:['d','k'],
      lvl3:['l','s'],
      lvl4:['a',';'],
      lvl5:['u','r'],
      lvl6:['i','e'],
      lvl7:['w','o'],
      lvl8:['q','p'],
      lvl9:['m','v'],
      lvl10:['c',','],
      lvl11:['x','.'],
      lvl12:['z','/'],
      lvl13:['h','g'],
      lvl14:['t','y'],
      lvl15:['n','b'],
      lvl16:['8','5'],
      lvl17:['4','9'],
      lvl18:['3','0'],
      lvl19:['7','6'],
      lvl20:['1','='],
    };

    const settings = {
      timePerQuestion:4000,
      nextLevelthreshold:10,
      maxMistakes:5,
    }

    const correctAnswer = ()=>{
      state.nrOfcorrect++;
      state.points++;
      state.currLvlProgress++;
      state.nrOfcorrect < settings.nextLevelthreshold ? state.correct++ : levelUp();
      newQuestion();
    }

    const gameModeOn = ()=>{
      // game mode on
      state.mode = 'on';
      // update char set
      updateCharSet();
      // start timer
      startTimer();
      // start timer animation
      uiMgr.resetTimerAnimation();
    }

    const gameModeOff = ()=>{
      state.mode = 'off';
      // stop timer
      clearTimeout(clock);
    }

    const levelStateReset = ()=>{
      state.currLevelProgress = 0;
      state.nrOfcorrect = 0;
    }

    const levelUp = ()=>{
      // regenerate one mistake point
      state.mistakesLeft< settings.maxMistakes ?  state.mistakesLeft++ : '';
      if (state.level < Object.keys(level_content).length){
          state.level++;
          updateCharSet();
          levelStateReset();
          uiMgr.renderKeyboardCharSet(); // update haracter set
      }else{
        // you won
        controller.stopGame();
      }
      if (state.level%3 === 0){ uiMgr.changeBg(); }

    }

    const newQuestion = ()=>{
      // set new character
      setRandChar();
      // reset timer
      clearTimeout(clock);
      startTimer();
      // update character UI
      uiMgr.renderChar();
      //update stats UI
      uiMgr.updateState()
      // start timer animation
      uiMgr.resetTimerAnimation();
    }

    const resetState = ()=>{
      state = {
        level: 1,
        charSet : [],
        currChar: 'f',
        nrOfcorrect:0,
        mistakesLeft:5,
        currLvlProgress:0,
        points:0,
        mode:'off',
        currLevelProgress: 5,
      }
    }

    const setRandChar = ()=>{
      state.currChar = state.charSet[
        Math.floor( Math.random()*state.charSet.length)
      ]
    }

    let clock;
    const startTimer = ()=>{
      clock = setTimeout(()=>{
        startTimer();
        setRandChar();
        wrongAnswer(null);
        //renderStats();
      }, settings.timePerQuestion)
    }

    const updateCharSet = ()=>{
      state.charSet = [];
      for(let lvl = 1; lvl <= state.level; lvl++){
        state.charSet.push(
          level_content['lvl' + lvl][0],
          level_content['lvl' + lvl][1],
        )
      }
    }

    const wrongAnswer = (e)=>{
      state.mistakesLeft--;
      state.points>1 ? state.points-- : '';
      // ui blink wrong key
      // exit if game over
      state.mistakesLeft >= 1 ? newQuestion() : controller.stopGame();;
      e!==null ?  uiMgr.blinkWrong(e) : '';
    }

    return {
      evaluateKey: (e)=>{
        state.currChar === e.key ? correctAnswer() : wrongAnswer(e)
        //blinkKey(e);
        uiMgr.blinkKey(e);
      },

      getCurrChar:()=>{
        return state.currChar;
      },

      getState : ()=>{
        return state;
      },

      getSettings: ()=>{return settings},

      resetState: ()=>{ resetState();},

      startGame: ()=>{
        // reset State
        resetState();
        gameModeOn();
      },

      stopGame: ()=>{
        gameModeOff();
      },
    }
  })();


  // UI Manager
  const uiMgr = (()=>{
    let keys, interval, timerState, prevBgNr;
    const timeInterval = 20; // how often clock is rerendered
    const clockInterval = 100 / (gameMgr.getSettings().timePerQuestion / timeInterval) // fro

    keys = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', 0, '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ]

    const blinkChar = ()=>{
      let char = document.getElementById('next-letter')
      char.classList.remove('charBlinkA')
      char.classList.remove('charBlinkB')
      char.classList.add('charBlinkA')
      setTimeout(()=>{
        char.classList.add('charBlinkB')
      },1);
    };

    let oldProgress = 0;
    const renderClock = ()=>{
      const correct = gameMgr.getState().nrOfcorrect;
      const nextLevelthreshold = gameMgr.getSettings().nextLevelthreshold;
      const newProgress = correct / nextLevelthreshold * 100;
      oldProgress < newProgress ? oldProgress++ : '';
      correct === 0 ? oldProgress = 0 : '';


      document.getElementById("clock-wrapper").innerHTML = `
            <!-- TIME CLOCK -->
          <svg viewBox="0 0 36 36" id="clock-time" class="clock">
            <path style=" stroke: #dadada";
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
              stroke-dasharray="${timerState}, 100"
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

    const renderKeyboard = () => {
      for (let row=0; row<keys.length; row++){
        let rowHTML = '';
        for(let key = 0; key < keys[row].length; key++){
          rowHTML = rowHTML + `<div id='key-${keys[row][key]}' class="key">
                                <p>
                                ${keys[row][key]}
                                </p>
                              </div>`
        }
        document.getElementById('row-'+row).innerHTML=rowHTML;
      }
    };

    const renderPts = () =>{
      document.getElementById('points-counter').innerHTML =
        gameMgr.getState().points +
        `<span style='font-size:10px'>pt</span>`;
    }

    const renderLvL = ()=>{
      document.getElementById('currentLevel').innerHTML =
        gameMgr.getState().level;
    }

    const renderMistakePts = () => {
      // update mistake points color
      mistakes = document.getElementById("mistakes").children
      for(let i = 0; i< mistakes.length; i++){
        i < gameMgr.getState().mistakesLeft ?
          mistakes[i].style.backgroundColor = 'var(--blue)' :
          mistakes[i].style.backgroundColor = 'var(--lightgray)'
      }
    }

    const renderState = ()=>{
      renderMistakePts();
      renderLvL();
      renderPts();
    }

    const renderKeyboardCharSet = ()=>{
      const state = gameMgr.getState();
      const myArr = document.getElementsByClassName('key')
      const charSetItems = Array.from(myArr).forEach((i)=>{
        item = i.children[0].innerHTML.replace(/\s/g, '')
        if (state.charSet.indexOf(item) !== -1){
          i.style.border = '1px solid var(--darkgray)';
        }
      })
    };

    const resetTimerAnimation = ()=>{
      interval = setInterval(()=>{
        timerState <= 100 ? timerState += clockInterval : timerState=0;
        renderClock()
      },timeInterval)
    }

    const stopTimerAnimation = ()=>{
      clearInterval(interval);
      timerState = 0;
    };

    // PUBLIC
    return {
      blinkKey: (e)=>{
        let keyBtn = document.getElementById(`key-${e.key}`)
        if(keyBtn!==null){
          keyBtn.classList.remove('blinkKeyA');
          keyBtn.classList.remove('blinkKeyB');
          keyBtn.classList.add('blinkKeyA');
          setTimeout(()=>{
            keyBtn.classList.add('blinkKeyB');
          },1)
        }
      },

      blinkWrong: (e)=>{
        tag = document.getElementById('next-letter');
        tag.innerHTML = e.key;
        tag.style.color = null;
        tag.style.transition = 'none';
        tag.style.textShadow = 'red 1px 0 3px';
        tag.style.color = 'red';
        setTimeout(()=>{
          tag.style.transition = null;
          tag.style.color = null;
          tag.style.textShadow = null;
          tag.innerHTML = gameMgr.getCurrChar();
        },200);
      },

      changeBg: ()=>{
        const body = document.querySelector('#bg-img');
        nr = Math.round(Math.random() * 7) + 1
        while(prevBgNr === nr){
          nr = Math.round(Math.random() * 7) + 1
        };
        prevBgNr = nr;
        let opacity = .5
        const speed = .1;
        const maxOpacity = .7;
        let interval = setInterval(()=>{
          opacity = opacity - speed;
          body.style.opacity = opacity;
          if (opacity < 0) {
            clearInterval(interval);
            body.src = `media/bg${prevBgNr}.jpg`;
            interval = setInterval( ()=> {
              opacity = opacity + speed;
              body.style.opacity = opacity;
              if(opacity>maxOpacity){clearInterval(interval)}
            }, 50);
          }
        },50);
      },

      renderKeyboardCharSet : renderKeyboardCharSet,
      renderChar: ()=>{
        let char = gameMgr.getCurrChar();
        document.getElementById('next-letter').innerHTML = `${char}`
        blinkChar();
      },

      resetTimerAnimation: ()=>{
        stopTimerAnimation();
        resetTimerAnimation();
      },

      startGame: ()=>{
        let char = gameMgr.getCurrChar();
        // create div with letter to guess
        document.getElementById('letter-wrapper').innerHTML =
          `<div id="next-letter" class="counter">${char}</div>`
        // create div for points counter
        document.getElementById('points-counter').innerHTML =
          gameMgr.getState().points + `<span style='font-size:10px'>pt</span>`;
        // retry button
        document.getElementById('start-game').innerHTML = 'retry'
        // render elements
        renderKeyboard();
        renderKeyboardCharSet();
        renderState();
        renderClock();
      },

      stopTimerAnimation: stopTimerAnimation,
      updateState: ()=>{
        renderState();
      },
    }
  })();


  // Main controller
  const controller  = (()=>{
    const setEventListeners = ()=>{
      // listen to start click
      document.getElementById('start').addEventListener('click', startGame)
    }

    const startGame = ()=>{
      // turn on state
      gameMgr.startGame()
      // turn on UI
      uiMgr.startGame();
      // turn on event listeners
      document.getElementById('start-game')
        .addEventListener('click', startGame)
      // start key listener
      document.addEventListener('keydown', gameMgr.evaluateKey);
    }

    // PUBLIC
    return {
      stopGame : ()=>{
        // turn off event
        document.removeEventListener('keydown', gameMgr.evaluateKey);
        // stop state
        gameMgr.stopGame();
        // stopUI
        uiMgr.updateState()
        uiMgr.stopTimerAnimation();
        setTimeout(()=>{
          document.getElementById('next-letter').innerHTML =
           "Game Over";
        },300)
      },

      init : ()=>{
        setEventListeners();
      }
    }
  })();
  controller.init()
}
