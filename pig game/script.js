"use strict";

let currentUser = 0;

let currentSocre = 0;

let userScore = [0 , 0];

let gameStatus = true;

const rollBtn = document.querySelector('.btn--roll');

const dice = document.querySelector('.dice');

const hold = document.querySelector('.btn--hold');

const reset = document.querySelector('.btn--new');

const player0Bord = document.querySelector('.player--0');
const player1Bord = document.querySelector('.player--1');
const turnUser = () => {

    document.querySelector(`#current--${currentUser}`).innerText = 0;

    currentUser = currentUser === 1 ? 0 : 1;

    player1Bord.classList.toggle('player--active');
    player0Bord.classList.toggle('player--active');
    currentSocre = 0;  
}


rollBtn.addEventListener('click' , () => {

    if(dice.classList.contains('hidden')) dice.classList.remove('hidden');
    if(gameStatus){
        let randomNumber = Math.ceil(Math.random() * 6 );
        dice.setAttribute("src" , `dice-${randomNumber}.png`);

        if(randomNumber !== 1 ){
            currentSocre += randomNumber;
            document.querySelector(`#current--${currentUser}`).innerText = currentSocre;
        }else{
            turnUser();
        }
    }
    
})


hold.addEventListener('click' , () => {
    if(gameStatus){
        userScore[currentUser] += currentSocre;
        document.querySelector(`#score--${currentUser}`).innerText = userScore[currentUser];
        if(userScore[0] >= 100 || userScore[1] >= 100 ){
            document.querySelector(`.player--${currentUser}`).classList.add('player--winner');
            gameStatus = false;
        }else{
            turnUser();
        }
    }
})


reset.addEventListener('click' , () => {
    document.querySelector(`.player--${currentUser}`).classList.remove('player--winner');
    currentUser = 0;
    currentSocre = 0;
    userScore = [0 , 0];
    gameStatus = true;
    document.querySelector(`#score--0`).innerText = 0;
    document.querySelector(`#score--1`).innerText = 0;
})