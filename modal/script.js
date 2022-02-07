"use strict";

const modalBtns = document.querySelectorAll('.show-modal');

const closeModalBtn = document.querySelector('.close-modal');

const modal = document.querySelector('.modal');

const overlay = document.querySelector('.overlay');

const openModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

for(let i=0 ; i < modalBtns.length ; i++) {
    modalBtns[i].addEventListener('click' , openModal );
}

closeModalBtn.addEventListener('click' , closeModal );

overlay.addEventListener('click' , closeModal );

// On Esc key press
document.addEventListener('keydown' , (e) => {
    if(e.code === "Escape" && !modal.classList.contains('hidden')){
        closeModal();
    }
})