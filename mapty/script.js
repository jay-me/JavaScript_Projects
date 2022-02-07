'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// class structure

// Application Architecture
class App{

    #map;
    #mapEvent;
    #workout = [];

    constructor(){
        this._getPosition();    

        // get data from localstorage
        this._getDataFromLocalStorage();

        ////////// All Event Handler /////////
        // when form submit
        form.addEventListener('submit' , this._newWorkout.bind(this) )
        // on select item change
        inputType.addEventListener('change' , this._toggleElevationField);
        containerWorkouts.addEventListener('click' , this._moveToPopup.bind(this));
    }
        
    _getPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition( 
                this._loadMap.bind(this) ,  
                function(){
                    alert('Not get your location, Try Again');
                })
        }
    }


    _loadMap(positioon){
        const {latitude , longitude} = positioon.coords;
                    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
            
                    // Leaflet code
                    const cordinates = [latitude , longitude];
                    this.#map = L.map('map').setView(cordinates, 15);
            
                    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.jaykaneriya.com/">JayKaneriya</a> contributors'
                    }).addTo(this.#map);
            
            
                    // handling map click
                    this.#map.on('click' , this._showForm.bind(this));

                    // rander data from local storage
                    this.#workout.forEach( wo => {
                        this._renderWorkout(wo);
                        this._displayWorkOutMaker(wo);
                    })
    }

    _showForm(mapEvent){
        this.#mapEvent = mapEvent;
        form.classList.remove('hidden');
        form.style.display = 'grid';
        inputDistance.focus();
    }

    _toggleElevationField(){
        inputElevation.closest('div').classList.toggle('form__row--hidden');
        inputCadence.closest('div').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){
        e.preventDefault();

            // validation method
            const validateInput = (...inputs) => inputs.every( inp => Number.isFinite(inp) );
            const allPositive = (...inputs) => inputs.every( inp => inp > 0);

            // Get the input data
            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;
            let workout;
            
            const {lat , lng } = this.#mapEvent.latlng;
            // if workout is running then create Running object
            if( type === 'running'){
                const cadence = +inputCadence.value;
                
                // input validation
                if( !validateInput(distance , duration ,  cadence) || !allPositive(distance , duration ,  cadence)) return alert('Input has to be positive numbers');

                workout = new Running([lat,lng] , distance , duration , cadence);
                this.#workout.push(workout);
                
            }
            // if workout is cycling then create Cycling object
            if( type === 'cycling'){
                const elevationGain = +inputElevation.value;
                
                if( !validateInput(distance , duration ,  elevationGain) || !allPositive(distance , duration)) return alert('Input has to be positive numbers');

                workout = new Cycling([lat,lng] , distance , duration , elevationGain);
                this.#workout.push(workout);
            }
            
            // Display Marker
            this._displayWorkOutMaker(workout);

            // render workout on screen
            this._renderWorkout(workout);

            // Clear input  & hide form
            this._hideFrom();

            // set data to localstorage
            this._setLocalstrorage();
    }

    _hideFrom(){
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.style.display = 'none';
        form.classList.remove('hidden');
    }

    _displayWorkOutMaker(workout){
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({    
                maxWidth : 250,
                minWidth : 100,
                autoClose : false,
                closeOnClick : false,
                className : `${workout.type}-popup`
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout){
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
            </div>
        `;

        if(workout.type === 'running') html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
            </div>
        </li>`;

        if(workout.type === 'cycling') html += `<div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(2)}</span>
        <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
        </div>
        </li>`
        
        form.insertAdjacentHTML('afterend' , html);

    }

    _moveToPopup(e){
        const workoutEl = e.target.closest('.workout');
        
        if(!workoutEl) return;
        const workout = this.#workout.find( workout => workout.id === workoutEl.dataset.id);

        // move to that coords
        this.#map.setView(workout.coords , 15 , {
            animate : true,
            pan : {
                duration : 1,
            },
        })
    }

    _setLocalstrorage(){
        localStorage.setItem('workouts' , JSON.stringify( this.#workout) );
    }

    _getDataFromLocalStorage(){
        const data = JSON.parse( localStorage.getItem('workouts') )
        if(!data) return;
        this.#workout = data;
    }

    reset(){
        localStorage.clear();
        location.reload();
    }
}


// Application Data
class Workout{

    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords , distance , duration){
        this.coords = coords; // [lat , lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }

    _setDescription(type){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${type} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}


class Running extends Workout{
    constructor(coords , distance , duration , cadence){
        super(coords , distance , duration);
        this.cadence = cadence;
        this.calPace();
        this._setDescription('Running');
        this.type = 'running';
    }
    calPace(){
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    constructor(coords , distance , duration , elevationGain){
        super(coords , distance , duration);
        this.elevationGain = elevationGain;
        this.calSpeed();
        this._setDescription('Cycling');
        this.type = 'cycling';
    }

    calSpeed(){
        // km/hr
        this.speed = this.distance / (this.duration * 60);
        return this.speed;
    }
}


// create object
const app = new App();


