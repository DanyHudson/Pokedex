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
    const data = await fetchPokemonData(); // Fetch the Pokémon data

    if (data && data.results) { // Check if data and results exist
        const results = data.results;

        for (let i = 0; i < results.length; i++) {
            const pokemonUrl = results[i].url;

            const pokemonData = await fetch(pokemonUrl).then(response => response.json());

            const pokemonId = pokemonData.id; // Pokémon ID
            const pokemonName = pokemonData.name; // Pokémon name
            const pokemonImage = pokemonData.sprites.other.home.front_default; // Pokémon image

            // Get types using the new function
            const types = getPokeTypes(pokemonData.types); // Call the new function to get types

            // Call the render function to create the card
            renderPokemonCard(pokemonId, pokemonName, pokemonImage, types);
        }
    } else {
        console.log('No Pokémon data found.');
    }
}

function getPokeTypes(types) {
    return types.map(typeInfo => {
        return `<span class="type ${typeInfo.type.name}" style="background-color: ${getTypeColor(typeInfo.type.name)};">${typeInfo.type.name}</span>`;
    }).join(''); // No need to join with a space since each type is already a separate span
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
function handleCardClick(id, name) {
    // You can perform any action here, such as displaying more details
    alert(`You clicked on ${name} (ID: ${id})!`); // Example action: show an alert
}