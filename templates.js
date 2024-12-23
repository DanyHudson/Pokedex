

function renderPokemonCard(id, name, image, types, backgroundColor) {
    const container = document.getElementById('pokemon-container');
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.style.backgroundColor = backgroundColor;

    card.innerHTML = `
        <span class="pokeIdName">No.${id} ${name}</span>
        <img src="${image}" alt="${name}"/>
        <div class="card-footer">
            <p>${types}</p>
        </div>
    `;

    card.onclick = function () {
        handleCardClick(id, name);
    };

    container.appendChild(card);
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

function renderModalHeader(id, name) {
    return `
        <div class="modal-header" style="border: none;"> 
            <button class="prevPokemn" type="button" onclick="showPrevPokemon()"><img src="./img/prev.svg"></button> 
            <h5 class="modal-title text-center" style="width: 100%;">No.${id} ${name.charAt(0).toUpperCase() + name.slice(1)}</h5> 
            <button class="nextPokemn" type="button" onclick="showNextPokemon()"><img src="./img/next.svg"></button>
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
                            <button><img src="./img/close.svg" alt=""></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}