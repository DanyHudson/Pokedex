function renderPokemonCard(id, name, image, types) {
    // Get the container where the cards will be displayed
    const container = document.getElementById('pokemon-container');

    // Create a new card element
    const card = document.createElement('div');
    card.className = 'pokemon-card'; // Add a class for styling (optional)

    // Create the content for the card
    card.innerHTML = `
        <span class="pokeIdName">No.${id} ${name}</span>
        <img src="${image}" alt="${name}" />
        <div class="card-footer">
            <p>${types}</p> <!-- Render types here -->
        </div>
    `;

    // Add an onclick event listener to the card
    card.onclick = function() {
        handleCardClick(id, name); // Call a function to handle the click event
    };

    // Append the card to the container
    container.appendChild(card);
}