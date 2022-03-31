//@description Deck Categories
let games = ["Detroit: Become Human","The Ascent","Shadowrun Returns","Cyberpunk 2077","Ghostrunner","Deus Ex","Ruiner","Observer","Detroit: Become Human","The Ascent","Shadowrun Returns","Cyberpunk 2077","Ghostrunner","Deus Ex","Ruiner","Observer",
];

let movies = ["Blade Runner","The Matrix","RoboCop","Altered Carbon","The Fifth Element","Ghost In The Shell","Total Recall","Black Mirror","Blade Runner","The Matrix","RoboCop","Altered Carbon","The Fifth Element","Ghost In The Shell","Total Recall","Black Mirror",
];

let series = ["Neuromancer","The Book of Strange New Things","When Gravity Fails","Data Runner","Slant","Van","The Windup Girl","Snow Crash","Neuromancer","The Book of Strange New Things","When Gravity Fails","Data Runner","Slant","Van","The Windup Girl","Snow Crash",
];

//@description Game Start Modal
const startModal = document.querySelector(".start-modal");
const selectDeckBox = document.querySelector(".start-modal__select-box");
const playBtn = document.querySelector(".start-modal__play-btn");

//@description Deck Selection
let selectedDeck = document.querySelector(".selected");

//@description Info Panel
const moves = document.querySelector(".moves-display");
const timer = document.querySelector(".time-display");
const stars = document.querySelectorAll(".fa-star");
const resetBtn = document.querySelector(".game-panel__reset-btn");

//@description All Cards
let cards = document.getElementsByClassName("deck__card");
let cardsArr = [...cards];

//@description Deck
const deck = document.querySelector(".deck");

//@description Matched & opened cards
let matchedCards = document.getElementsByClassName("matched");
let openedCards = document.getElementsByClassName("open");

//@description Best Score
const scoreBox = document.querySelector(".score-panel__score-box");
const bestTimesList = document.querySelector(".score-panel__scores-display");

//@description Game Completed Modal
const winModal = document.querySelector(".win-modal");
const winModalScore = document.querySelector(".win-modal__score");
const winModalStars = document.querySelector(".win-modal__stars");
const winModalYesBtn = document.querySelector(".win-modal__yes-btn");
const winModalNoBtn = document.querySelector(".win-modal__no-btn");

let openedCardsArr = [];
let results = [];
let timeCounter = 0;
let countTime = null;
let movesCounter = 0;
let starCounter = 0;
let storageAvailable = false;
let deckItems = games; //default deck category

//@description Select Deck Category in Start Modal
const selectDeck = (e) => {
  if (e.target.classList.contains("start-modal__deck-cat")) {
    selectedDeck.classList.remove("selected");
    selectedDeck = e.target;
    selectedDeck.classList.add("selected");
  }

  if (e.target.classList.contains("games")) {
    deckItems = games;
  }
  if (e.target.classList.contains("movies")) {
    deckItems = movies;
  }
  if (e.target.classList.contains("series")) {
    deckItems = series;
  }
};


// @description Set times and player name to localStorage
const addTimes = () => {
  const name = prompt("You got a highscore! Enter name:");
  const newScore = { timeCounter, name };
  results.push(newScore);
  results.sort((a, b) => a.timeCounter - b.timeCounter);
  localStorage.setItem("times", JSON.stringify(results));
};
  
// @description Get 5 best times from localStorage
const showHighTimes = () => {
    const retrievedTimes = JSON.parse(localStorage.getItem('times')) ?? [];
    bestTimesList.innerHTML = retrievedTimes.map(
      (time) => `<li>${time.name} - ${time.timeCounter} sec</li>`
    ).slice(0, 5).join("");
};


//@description Fisher Yates Algorithm to shuffle array of cards
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

//@description Shuffle & load choosen array to deck
const loadDeck = () => {
  shuffle(deckItems);
  for (let i = 0; i < cardsArr.length; i++) {
    cardsArr[i].innerHTML = deckItems[i];
  }
};

//@description Game timer
const startTimer = () => {
  timeCounter++;
  timer.textContent = timeCounter;
};

//@description Game moves
const incrementMoves = () => {
  movesCounter++;
  moves.textContent = movesCounter;
  decrementStars();
};

//@description Game stars
const decrementStars = () => {
  if (movesCounter === 16) {
    stars[2].classList.remove("fas");
    stars[2].classList.add("far");
    starCounter--;
  } else if (movesCounter === 24) {
    stars[1].classList.remove("fas");
    stars[1].classList.add("far");
    starCounter--;
  }
};

//@description Disable click event on all cards
const disableCards = () => {
  Array.prototype.filter.call(cards, (card) => {
    card.classList.add("disabled");
  });
};

//@description Disable click event on matched cards and enable on the rest
const enableCards = () => {
  Array.prototype.filter.call(cards, (card) => {
    card.classList.remove("disabled");
    for (let i = 0; i < matchedCards.length; i++) {
      matchedCards[i].classList.add("disabled");
    }
  });
};

const startGame = (e) => {
  if (
    e.target.classList.contains("deck__card") &&
    !e.target.classList.contains("open") &&
    !e.target.classList.contains("matched")
  ) {
    e.target.classList.add("open");
    e.target.classList.add("show");
    openedCardsArr.push(e.target);

    if (openedCardsArr.length === 2) {
      incrementMoves();

      //@description When cards matched
      if (openedCardsArr[0].innerHTML === openedCardsArr[1].innerHTML) {
        for (let card of openedCardsArr) {
          card.classList.add("matched");
        }

        if (matchedCards.length === cardsArr.length) {
          completeGame();
        }
        openedCardsArr = [];
      } else {
        //@description When cards don't matched
        disableCards();
        setTimeout(() => {
          for (let card of openedCardsArr) {
            card.classList.remove("open");
            card.classList.remove("show");
          }
          enableCards();
          openedCardsArr = [];
        }, 1500);
      }
    }
  }

  // @description 1sek interval for game timer function
  if (!countTime) {
    countTime = setInterval(startTimer, 1000);
  }
};

const resetGame = () => {
  //1. RESET DECK
  // @description Remove classes from clicked cards & clear openedCards Array in case if is middle of the game
  while (openedCards.length) {
    openedCards[0].classList.remove("open", "show", "matched", "disabled");
  }
  openedCardsArr = [];

  //2. RESET GAME PANEL INFO
  // @description Set game moves to 0
  movesCounter = 0;
  moves.textContent = movesCounter;

  // @description Set game timer to 0
  clearInterval(countTime);
  countTime = null;
  timeCounter = 0;
  timer.textContent = timeCounter;

  // @description Reset stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.remove("far");
    stars[i].classList.add("fas");
  }

  // @description  Enable click event on reset button if is disabled
  resetBtn.classList.remove("disabled");

  // 4. SHOW/HIDE DOM ELEMENTS
  //@description  Open start modal window
  startModal.classList.add("show-start-modal");

  // @description  Close wind modal if open
  winModal.classList.remove("show-win-modal");

  // @description  Hide scores list
  scoreBox.classList.remove("show");
};

const completeGame = () => {
  // @description Stops timer
  clearInterval(countTime);

  // @description Call localStorage functions
  addTimes();
  showHighTimes();

  // @ description Open Congratulations Window
  winModal.classList.add("show-win-modal");

  // @description Shows time and moves in modal
  winModalScore.textContent = `${timeCounter} seconds & ${movesCounter} moves.`;

  // @description Copy stars rating to modal
  for (let i = 0; i < stars.length; i++) {
    let starsCopy = stars[i].cloneNode(true);
    winModalStars.appendChild(starsCopy);
  }
  // @discription Disable reset button while congratulations window is displaing
  resetBtn.classList.add('disabled');
};

const closeStartModal = () => {
  startModal.classList.remove("show-start-modal");
  loadDeck();

  // @description Show scores list
  scoreBox.classList.add("show");

  // @description Load scores from localStorage
  showHighTimes();

  // @description Clear stars from congratulations window to avoid dubble
  winModalStars.innerHTML = "";
};

const closeWinModal = () => {
  winModal.classList.remove("show-win-modal");
  resetBtn.classList.remove("disabled");
};

// ----Event Listeners---- //
selectDeckBox.addEventListener("click", selectDeck);
playBtn.addEventListener("click", closeStartModal);
deck.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
winModalYesBtn.addEventListener("click", resetGame);
winModalNoBtn.addEventListener("click", closeWinModal);
