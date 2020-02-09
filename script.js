const API_KEY = '7aca6ef86ceb095034f88fa36aa6e3f9';
const ENDPOINT_URL = 'http://ws.audioscrobbler.com/2.0/';

const errorMessageContainer = document.querySelector('.error-message-container');
const errorMessage = document.querySelector('.error-message');
const results = document.querySelector('.results');

function init() {
    const searchButton = document.querySelector('.search-button');
    const countryInput = document.querySelector('#country');
    
    searchButton.addEventListener('click', function(e) {
        const country = countryInput.value;
        e.preventDefault();
        getTracks(country);
        clearInput(countryInput)
    });
}

function getTracks(country) {
    fetch(`${ENDPOINT_URL}?method=geo.gettoptracks&country=${country}&api_key=${API_KEY}&format=json`)
        .then(response => response.json())
        .then(response => {
            if(response.tracks) {
            clearError();
            clearResults();
            displayResults(response);

            } else {
                throw new Error(response.message)
            }         
        })
        .catch(error => {
            clearResults();
            setError(error);            
        })
}

function clearInput(input) {
    input.value = '';
}

function displayResults(data) {
    const tracks = data.tracks.track;
    tracks.forEach((track,index) => {
        const trackNode = document.createElement('li');
        trackNode.classList.add('track');
        trackNode.innerHTML = `
        <div class="left">
            <p>
                <span class="order-number">${index + 1}.</span>
                ${track.name} - <a href=${track.artist.url}>${track.artist.name}</a>
            </p>
            <p>Listeners: ${track.listeners}</p>
        </div>
        <div class="right">
            <figure>
                <img src=${track.image[0]['#text']}>
            </figure>
        </div>
        `  
    results.appendChild(trackNode);
    })
}

function clearResults() {
    results.innerHTML = '';
}

function setError(error) {
    errorMessageContainer.style.display = "block";
    errorMessage.textContent = error;
}

function clearError() {
    errorMessageContainer.style.display = "none";
    errorMessage.textContent = '';
}

init();
