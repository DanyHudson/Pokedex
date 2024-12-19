let allPokemonData = []; // Global array to store all Pokémon data
let displayedCount = 20; // Number of Pokémon currently displayed
let maxPokemonCount = 100; // Define a maximum limit for Pokémon to be fetched
let currentDisplayedId = null; // Store the currently displayed Pokémon ID
let modalInstance;



function init() {
    // Show the loading screen when the page starts loading
    document.getElementById('loading-screen').style.display = 'flex'; // Ensure the loading screen is visible

    // Fetch and display Pokémon cards
    displayPokemonCards().then(() => {
        // Hide the loading screen once the Pokémon cards are displayed
        hideLoadingScreen();
    });
}
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) { // Check if the loading screen exists
        loadingScreen.style.display = 'none'; // Hide the loading screen
        loadingScreen.remove(); // Remove it from the DOM
    }
}

// Listen for the window load event
window.addEventListener('load', () => {
    // Hide the loading screen when the window has fully loaded
    hideLoadingScreen();
});

async function fetchPokemonData() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${Math.min(displayedCount, maxPokemonCount)}&offset=0`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching the Pokémon data:', error);
    }
}

function initializeSearch() {
    const searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase(); // Get the search term in lowercase
        const filteredPokemon = allPokemonData.filter(pokemon => {
            const pokemonName = pokemon.name.toLowerCase(); // Convert Pokémon name to lowercase
            const pokemonId = pokemon.id.toString(); // Convert Pokémon ID to string
            return pokemonName.includes(searchTerm) || pokemonId.includes(searchTerm); // Check if name or ID includes the search term
        });

        // Clear the current displayed Pokémon
        clearPokemonDisplay(); // Function to clear currently displayed Pokémon

        // Call the new function to render only the first matching Pokémon
        renderOnlyFirstMatch(filteredPokemon);
    });
}

// Function to clear currently displayed Pokémon (you need to implement this)
function clearPokemonDisplay() {
    const pokemonContainer = document.getElementById('pokemon-container'); // Assuming you have a container for Pokémon cards
    while (pokemonContainer.firstChild) {
        pokemonContainer.removeChild(pokemonContainer.firstChild); // Remove all child elements (Pokémon cards)
    }

}
function renderOnlyFirstMatch(filteredPokemon) {
    if (filteredPokemon.length > 0) {
        const pokemon = filteredPokemon[0]; // Get the first matching Pokémon
        const pokemonId = pokemon.id; // Pokémon ID
        const pokemonName = capitalizeFirstLetter(pokemon.name); // Capitalize the first letter of the Pokémon name
        const pokemonImage = pokemon.sprites.other.home.front_default; // Pokémon image
        const types = getPokeTypes(pokemon.types); // Call the new function to get types

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types); // Render the filtered Pokémon
    }
}


// Call the initializeSearch function when the page loads
document.addEventListener('DOMContentLoaded', initializeSearch);



async function displayPokemonCards() {
    const data = await fetchPokemonData();
    if (data && data.results) {
        const results = data.results;

        for (let i = 0; i < results.length; i++) {
            const pokemonUrl = results[i].url;
            const pokemonData = await fetch(pokemonUrl).then(response => response.json());

            // Call the new function to process the Pokémon data
            processPokemonData(pokemonData, i);
        }
    }
}

function processPokemonData(pokemonData, index) {
    allPokemonData.push(pokemonData); // Store the Pokémon data in the global array

    if (index < displayedCount) { // Only render the first 'displayedCount' Pokémon
        const pokemonId = pokemonData.id; // Pokémon ID
        const pokemonName = capitalizeFirstLetter(pokemonData.name); // Capitalize the first letter of the Pokémon name
        const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image
        const types = getPokeTypes(pokemonData.types); // Call the new function to get types

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
    }
}

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPokeTypes(types) {
    return types.map(typeInfo => {
        return `<span class="type ${typeInfo.type.name}" style="background-color: ${getTypeColor(typeInfo.type.name)};">${typeInfo.type.name}</span>`;
    }).join('  ');
}

function getTypeColor(type) {
    const colors = {
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#F0B6BC',
        normal: '#A8A878',
    };

    return colors[type] || '#FFFFFF';
}

// Function to handle card click
async function handleCardClick(id, name) {
    currentDisplayedId = id; // Store the current Pokémon ID
    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json());
    const pokemonImage = pokemonData.sprites.other.home.front_default;
    const pokemonHeight = pokemonData.height;
    const pokemonWeight = pokemonData.weight;
    const pokemonBaseExperience = pokemonData.base_experience;

    const pokemonDescription = `
        <strong>Height:</strong> ${pokemonHeight / 10} m<br>
        <strong>Weight:</strong> ${pokemonWeight / 10} kg<br>
        <strong>Base Experience:</strong> ${pokemonBaseExperience}
    `;

    renderPokePopup(pokemonImage, id, name, pokemonDescription);
}

async function showPrevPokemon() {
    const prevId = currentDisplayedId - 1; // Get the previous Pokémon ID
    if (prevId > 0) { // Ensure the ID is valid
        handleCardClick(prevId, allPokemonData[prevId - 1].name); // Fetch the previous Pokémon
    } else {
        console.error('No previous Pokémon available.');
    }
}

async function showNextPokemon() {
    const nextId = currentDisplayedId + 1; // Get the next Pokémon ID
    if (nextId <= allPokemonData.length) { // Ensure the ID is within bounds
        handleCardClick(nextId, allPokemonData[nextId - 1].name); // Fetch the next Pokémon
    } else {
        console.error('No next Pokémon available.Load more Pokemon');
    }
}

function renderPokePopup(image, id, name, description, index) {
    let modal = document.querySelector('.modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.setAttribute('role', 'dialog');

        modal.innerHTML = renderModal(image, id, name, description, index);
        document.body.appendChild(modal);
        modalInstance = new bootstrap.Modal(modal, {
            backdrop: true,
            keyboard: false
        });
    }

    handleModal(modal, image, id, name, description, index);
    modalInstance.show();
}

function handleModal(modal, image, id, name, description, index) {
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
        modalInstance = null;
    });

    modal.querySelector('.modal-content').innerHTML = `
        ${renderModalHeader(id, name, index)}
        ${renderModalBody(image, description)}
    `;
}


async function loadMorePokemon() {
    const offset = displayedCount; // Set the offset to the current displayed count
    const url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`; // Fetch the next 20 Pokémon

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const results = data.results;

        // Call the new function to process the Pokémon data
        await morePokemonData(results);

        displayedCount += results.length; // Update displayedCount based on how many were loaded
    } catch (error) {
        console.error('Error loading more Pokémon:', error);
    }
}

async function morePokemonData(results) {
    for (let i = 0; i < results.length; i++) {
        const pokemonUrl = results[i].url;
        const pokemonData = await fetch(pokemonUrl).then(response => response.json());

        allPokemonData.push(pokemonData); // Store the Pokémon data in the global array

        const pokemonId = pokemonData.id; // Pokémon ID
        const pokemonName = capitalizeFirstLetter(pokemonData.name); // Capitalize the first letter of the Pokémon name
        const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image
        const types = getPokeTypes(pokemonData.types); // Call the new function to get types

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
    }
}

function renderLoadMoreButton() {
    const buttonContainer = document.getElementById('button-container');
    const loadMoreButton = document.createElement('button');
    loadMoreButton.innerText = 'Load More Pokémon';
    loadMoreButton.className = 'loadMore';
    loadMoreButton.onclick = loadMorePokemon;
    //document.body.appendChild(loadMoreButton);  Append the button to the body or a specific container
    buttonContainer.appendChild(loadMoreButton);
}

// Call this function after displaying the initial Pokémon cards
renderLoadMoreButton();