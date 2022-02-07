'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2022-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-05-27T17:01:17.194Z',
      '2020-07-11T23:36:17.929Z',
      '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


/////////////////////////////////////////////////
// labelDate.innerText = new Intl.DateTimeFormat('en-IN').format(new Date());

const options = {
    hour : 'numeric',
    minute : 'numeric',
    day : 'numeric',
    month : 'numeric',
    year : 'numeric',
}
const formateDate = (monDate , locale) => {
    const calDaysPassed = (d1,d2) => Math.abs(d1-d2)/(1000*60*60*24);
    const date = new Date(monDate);
    const daysPassed = Math.round(calDaysPassed( new Date() , date));
    if(daysPassed == 0) return 'Today';
    else if(daysPassed == 1) return 'Yesterday';
    else if(daysPassed < 7) return `${daysPassed} days ago`;
    else return `${new Intl.DateTimeFormat(locale , options).format(new Date())}`;   
}

const formateCur = (value , local , currency) => {
    return new Intl.NumberFormat(local , {style:'currency' , currency : currency}).format(value);
}

const displayMovments = (account , sort = false) => {
        containerMovements.innerHTML = '';
        const mov = sort ? account.movements.slice().sort( (a,b) => a -b ) : account.movements ;
        
        mov.forEach((movement, index) => {
            const displayDate = formateDate(account.movementsDates[index] , account.locale)
            const formatedAmount = formateCur(movement , account.locale , account.currency);
            const type = movement > 0 ? 'deposit' : 'withdrawal';
            const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">
              ${index+1} ${type}
            </div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatedAmount}</div>
          </div>`
          containerMovements.insertAdjacentHTML('afterbegin' , html);
        });
}

const createUserName = (accs) => {
    accs.forEach( acc => {
        acc.userName = acc.owner.toLowerCase().split(' ').map( v => v[0]).join('');
    })
}

const calDisplayBalance = (acc) => {
    acc.balance = acc.movements.reduce( (acc , value) => acc+value , 0);
    labelBalance.innerText =  formateCur(acc.balance , acc.locale , acc.currency);
}

const displaySummary = (acc) => {
    const sumOfDiposit = acc.movements.filter( val => val > 0).reduce( (acc , val) => acc+val , 0);
    labelSumIn.innerText = formateCur(sumOfDiposit , acc.locale , acc.currency);

    const sumOfWithdrawal = Math.abs(acc.movements.filter( val => val < 0).reduce( (acc , val) => acc+val , 0));
    labelSumOut.innerText = formateCur(sumOfWithdrawal , acc.locale , acc.currency);

    const intrest = acc.movements.filter(val => val > 0 ).map( val => (val * acc.interestRate)/100).filter(val => val >= 1).reduce( (acc,val) => acc+val , 0);
    labelSumInterest.innerText = formateCur(intrest , acc.locale , acc.currency);
}


createUserName(accounts);

// Update UI
const updateUI = (acc) => {
    containerApp.style.opacity = 1;
    labelWelcome.innerText = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    displayMovments(acc);
    // Calculate balance
    calDisplayBalance(currentAccount);
    // Calculate summery
    displaySummary(currentAccount);
    // const now = new Intl.DateTimeFormat('en-IN').format(now);    
    // labelDate.innerText = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    labelDate.innerText = new Intl.DateTimeFormat(acc.locale , options).format(new Date());
}


// Login
let currentAccount , timer , logoutTime = 120;

btnLogin.addEventListener('click' , (e) => {
    e.preventDefault();
    // inputLoginUsername  inputLoginPin
    currentAccount = accounts.find( acc => acc.userName === inputLoginUsername.value);

    if( currentAccount?.pin === Number(inputLoginPin.value) ){
        // Display UI and welcome message
        updateUI(currentAccount);
        // Clear inputs
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        // start logout timer
        if(timer) clearInterval(timer);
        logoutTimer();
    }
})


// Transfer 
btnTransfer.addEventListener('click' , (e) => {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const reciverAcc =  accounts.find( acc => acc.userName === inputTransferTo.value);

    if(amount > 0 && currentAccount.balance >= amount && reciverAcc && reciverAcc.userName !== currentAccount.userName ){
        currentAccount.movements.push(-amount);
        reciverAcc.movements.push(amount);
        currentAccount.movementsDates.push(new Date());
        reciverAcc.movementsDates.push(new Date());
        updateUI(currentAccount);   
        // clear inputs
        inputTransferAmount.value = inputTransferTo.value = '';
        inputTransferTo.blur();

        // reset logout time
        logoutTime = 120;
    }
})


// Loan
btnLoan.addEventListener('click' , (e) => {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some( ele => ele > 0.1*amount)){

        setTimeout( () => {
            currentAccount.movements.push(amount);
            currentAccount.movementsDates.push(new Date());
            updateUI(currentAccount);
            inputLoanAmount.value = '';
        } , 2500)
        // reset logout time
        logoutTime = 120;
    }
})



// Close account
btnClose.addEventListener('click' , (e) => {
    e.preventDefault();
    if( inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){

        const index = accounts.findIndex( acc => acc.userName === inputCloseUsername.value);
        console.log(index);
        // delete user
        accounts.splice(index , 1);

        // Hide UI
        containerApp.style.opacity = 0;
        labelWelcome.innerText = `Log in to get started`;
    }    
})


// sort
let toggle = true;
btnSort.addEventListener('click' , (e) => {
    e.preventDefault();
    displayMovments(currentAccount , toggle);
    toggle = !toggle; 
})


// logout timer

const logoutTimer = () => {

    const tick = () => {
        // min & sec
        const min = `${parseInt(logoutTime/60)}`.padStart(2 , '0');
        const sec = `${logoutTime % 60}`.padStart(2,'0');
        labelTimer.innerText = `${min}:${sec}`;

        // check 0 or not
        if(logoutTime <= 0) {
            clearInterval(timer);
            containerApp.style.opacity = 0;
            labelWelcome.innerText = `Log in to get started`;
        }    
        // decrese time
        logoutTime--;
    }
    tick();
    timer = setInterval( tick , 1000);
}