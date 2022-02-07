console.log("Connected!!");

let randomNumber = Math.ceil(Math.random() * 20);

let score = 20;

let highScore = 0;


// reset 
const resetBtn = document.querySelector('.again');
resetBtn.addEventListener('click' , () => {
    // re calculate random number
    randomNumber = Math.ceil(Math.random() * 20);
    // reset score
    score = 20;
    document.querySelector('.score').innerText = 20;
    // reset message and style
    document.querySelector('.message').innerText = 'Start guessing...';
    document.querySelector('body').style.backgroundColor = '#222';
    const numBox = document.querySelector('.number');
    numBox.innerText = '?';
    numBox.style.width = '15rem';
    // reseting input feild
    document.querySelector('.guess').value = '';
})

// Check for win 
const checkBtn = document.querySelector('.check');
checkBtn.addEventListener('click' , () => {
    const value = Number(document.querySelector('.guess').value);
    if(score > 0){
        if(!value){
            document.querySelector('.message').innerText = '⛔ Invalid Guessed!';
        }else if(value > randomNumber){
            document.querySelector('.message').innerText = '📈 High';
            score--;
        }else if(value < randomNumber){
            document.querySelector('.message').innerText = '📉 Low';
            score--;
        }else if(value === randomNumber){   
            document.querySelector('.message').innerText = '🎉 Correct Number';
            document.querySelector('body').style.backgroundColor = '#60b347';
            const numBox = document.querySelector('.number');
            numBox.innerText = randomNumber;
            numBox.style.width = '25rem';
            if(score > highScore) highScore = score;
            document.querySelector('.highscore').innerText = highScore;
        }else if(value < 0 && value > 20){
            document.querySelector('.message').innerText = '⛔ Invalid Guessed!';
        }

        document.querySelector('.score').innerText = score;
    }else{  
        document.querySelector('.message').innerText = '⛔ You Loss!';
    }
})