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

function renderModalHeader(id, name) {
    return `
        <div class="modal-header" style="border: none;"> 
            <button class="prevPokemn" type="button" onclick="showPrevPokemon()" style="border-radius: 50%;"><img src="/img/prev.svg"></button> 
            <h5 class="modal-title text-center" style="width: 100%;">No.${id} ${name.charAt(0).toUpperCase() + name.slice(1)}</h5> 
            <button class="nextPokemn" type="button" onclick="showNextPokemon()" style="border-radius: 50%;"><img src="/img/next.svg"></button>
        </div>
    `;
}

function renderModalBody(image, description) {
    return `
        <div class="modal-body" style="border: none;"> 
            <div class="card mb-3" style="max-width: 540px; border: none;"> 
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${image}" class="img-fluid rounded-start" alt="${name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-text">${description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}