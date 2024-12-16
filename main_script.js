let allPokemonData = []; // Global array to store all Pokémon data
let displayedCount = 20; // Number of Pokémon currently displayed
let currentDisplayedId = null; // Store the currently displayed Pokémon ID
let modalInstance;



function init() {
    displayPokemonCards();
}

async function fetchPokemonData() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=35&offset=0';
    
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

async function displayPokemonCards() {
    const data = await fetchPokemonData();

    if (data && data.results) {
        const results = data.results;

        for (let i = 0; i < results.length; i++) {
            const pokemonUrl = results[i].url;
            const pokemonData = await fetch(pokemonUrl).then(response => response.json());

            allPokemonData.push(pokemonData); // Store the Pokémon data in the global array

            if (i < displayedCount) { // Only render the first 'displayedCount' Pokémon
                const pokemonId = pokemonData.id; // Pokémon ID
                const pokemonName = pokemonData.name; // Pokémon name
                const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image
                const types = getPokeTypes(pokemonData.types); // Call the new function to get types

                renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
            }
        }
    } else {
        console.log('No Pokémon data found.');
    }
}

function getPokeTypes(types) {
    return types.map(typeInfo => {
        return `<span class="type ${typeInfo.type.name}" style="background-color: ${getTypeColor(typeInfo.type.name)};">${typeInfo.type.name}</span>`;
    }).join('  '); // No need to join with a space since each type is already a separate span
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
        // Add more types and their colors as needed
    };

    return colors[type] || '#FFFFFF'; // Default to white if type not found
}

// Function to handle card click
async function handleCardClick(id, name) {
    currentDisplayedId = id; // Store the current Pokémon ID
    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json());
    const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image
    const pokemonHeight = pokemonData.height; // Pokémon height
    const pokemonWeight = pokemonData.weight; // Pokémon weight
    const pokemonBaseExperience = pokemonData.base_experience; // Pokémon base experience

    // Create a description string with height, weight, and base experience
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
        console.error('No next Pokémon available.');
    }
}

function renderPokePopup(image, id, name, description, index) {
    // Check if the modal already exists
    let modal = document.querySelector('.modal');

    // If the modal doesn't exist, create it
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.setAttribute('role', 'dialog'); // Set role for accessibility

        modal.innerHTML = renderModal(image, id, name, description, index);

        // Append the modal to the body
        document.body.appendChild(modal);

        // Initialize the modal instance
        modalInstance = new bootstrap.Modal(modal, {
            backdrop: true, // Allow closing the modal by clicking outside
            keyboard: false // Prevent closing the modal with the keyboard
        });

        // Remove the modal from the DOM after it's closed
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
            modalInstance = null; // Reset the modal instance
        });
    } else {
        // If the modal already exists, update its content
        modal.querySelector('.modal-content').innerHTML = `
            ${renderModalHeader(id, name, index)}
            ${renderModalBody(image, description)}
        `;
    }

    // Show the modal
    modalInstance.show();
}

function renderModal(image, id, name, description, index) {
    return `
        <div class="modal-dialog" style="margin-top: 10%;">
            <div class="modal-content" style="border: none;">
                ${renderModalHeader(id, name, index)}
                ${renderModalBody(image, description)}
            </div>
        </div>
    `;
}

async function loadMorePokemon() {
    const data = await fetchPokemonData(); // Fetch the Pokémon data
    const results = data.results;

    for (let i = displayedCount; i < displayedCount + 20 && i < results.length; i++) {
        const pokemonUrl = results[i].url;
        const pokemonData = await fetch(pokemonUrl).then(response => response.json());

        allPokemonData.push(pokemonData); // Store the Pokémon data in the global array

        const pokemonId = pokemonData.id; // Pokémon ID
        const pokemonName = pokemonData.name; // Pokémon name
        const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image
        const types = getPokeTypes(pokemonData.types); // Call the new function to get types

        renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
    }

    displayedCount += 20; // Increase the displayed count
}

function renderLoadMoreButton() {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.innerText = 'Load More Pokémon';
    loadMoreButton.onclick = loadMorePokemon;
    document.body.appendChild(loadMoreButton); // Append the button to the body or a specific container
}

// Call this function after displaying the initial Pokémon cards
renderLoadMoreButton();