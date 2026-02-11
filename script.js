const container = document.getElementById('pokedexContainer');
const stats = document.getElementById('stats');
let pokemonsData = []; // Guardará os dados de todos os pokemons
let capturados = JSON.parse(localStorage.getItem('capturados')) || [];

async function carregarPokedex() {
    container.innerHTML = "Carregando Pokédex...";
    
    for (let i = 1; i <= 151; i++) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await resp.json();
        pokemonsData.push(data);
    }
    renderizar(pokemonsData);
}

function renderizar(lista) {
    container.innerHTML = "";
    lista.forEach(pokemon => {
        const estaCapturado = capturados.includes(pokemon.id);
        const card = document.createElement('div');
        card.classList.add('card');
        if (estaCapturado) card.classList.add('capturado');

        card.innerHTML = `
            <p>#${pokemon.id}</p>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button class="btn-capturar" onclick="alternarCaptura(${pokemon.id})">
                ${estaCapturado ? 'Soltar' : 'Capturar!'}
            </button>
        `;
        container.appendChild(card);
    });
    atualizarStats();
}

function alternarCaptura(id) {
    if (capturados.includes(id)) {
        capturados = capturados.filter(pId => pId !== id); 
    } else {
        capturados.push(id); 
    }
    localStorage.setItem('capturados', JSON.stringify(capturados));
    filtrar('todos'); 
}

function filtrar(tipo) {
    let listaFiltrada = pokemonsData;
    if (tipo === 'capturados') {
        listaFiltrada = pokemonsData.filter(p => capturados.includes(p.id));
    } else if (tipo === 'faltam') {
        listaFiltrada = pokemonsData.filter(p => !capturados.includes(p.id));
    }
    renderizar(listaFiltrada);
}

function atualizarStats() {
    stats.innerText = `Capturados: ${capturados.length} / 151`;
}

carregarPokedex();