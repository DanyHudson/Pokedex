let allPokemonData = [];
let displayedCount = 20;
let maxPokemonCount = 100; 
let currentDisplayedId = null;
let modalInstance;

function init() {
    document.getElementById('loading-screen').style.display = 'flex';
    displayPokemonCards().then(() => {
        hideLoadingScreen();
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.remove(); 
    }
}

window.addEventListener('load', () => {
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
        const searchTerm = searchBar.value.toLowerCase();
        const filteredPokemon = allPokemonData.filter(pokemon => {
            const pokemonName = pokemon.name.toLowerCase();
            const pokemonId = pokemon.id.toString();
            return pokemonName.includes(searchTerm) || pokemonId.includes(searchTerm);
        });
        clearPokemonDisplay();
        renderOnlyFirstMatch(filteredPokemon);
    });
}

function clearPokemonDisplay() {
    const pokemonContainer = document.getElementById('pokemon-container');
    while (pokemonContainer.firstChild) {
        pokemonContainer.removeChild(pokemonContainer.firstChild);
    }

}
function renderOnlyFirstMatch(filteredPokemon) {
    if (filteredPokemon.length > 0) {
        const pokemon = filteredPokemon[0];
        const pokemonId = pokemon.id; 
        const pokemonName = capitalizeFirstLetter(pokemon.name); 
        const pokemonImage = pokemon.sprites.other.home.front_default;
        const types = getPokeTypes(pokemon.types); 
        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types); 
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

            processPokemonData(pokemonData, i);
        }
    }
}

function processPokemonData(pokemonData, index) {
    allPokemonData.push(pokemonData);

    if (index < displayedCount) {
        const pokemonId = pokemonData.id;
        const pokemonName = capitalizeFirstLetter(pokemonData.name); 
        const pokemonImage = pokemonData.sprites.other.home.front_default; 
        const types = getPokeTypes(pokemonData.types); 

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
    }
}

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

async function handleCardClick(id, name) {
    currentDisplayedId = id; 
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
    const prevId = currentDisplayedId - 1;
    if (prevId > 0) {
        handleCardClick(prevId, allPokemonData[prevId - 1].name); 
    } else {
        console.error('No previous Pokémon available.');
    }
}

async function showNextPokemon() {
    const nextId = currentDisplayedId + 1;
    if (nextId <= allPokemonData.length) {
        handleCardClick(nextId, allPokemonData[nextId - 1].name); 
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

        await morePokemonData(results);

        displayedCount += results.length;
    } catch (error) {
        console.error('Error loading more Pokémon:', error);
    }
}

async function morePokemonData(results) {
    for (let i = 0; i < results.length; i++) {
        const pokemonUrl = results[i].url;
        const pokemonData = await fetch(pokemonUrl).then(response => response.json());

        allPokemonData.push(pokemonData);

        const pokemonId = pokemonData.id; 
        const pokemonName = capitalizeFirstLetter(pokemonData.name);
        const pokemonImage = pokemonData.sprites.other.home.front_default;
        const types = getPokeTypes(pokemonData.types); 

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
    }
}

function renderLoadMoreButton() {
    const buttonContainer = document.getElementById('button-container');
    const loadMoreButton = document.createElement('button');
    loadMoreButton.innerText = 'Load More Pokémon';
    loadMoreButton.className = 'loadMore';
    loadMoreButton.onclick = loadMorePokemon;
    buttonContainer.appendChild(loadMoreButton);
}


renderLoadMoreButton();


