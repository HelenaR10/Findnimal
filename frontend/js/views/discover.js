async function discover(search, filter) {
    showLoader();

    try {
        const response = await fetch('../backend/controllers/discoverController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                endpoint: 'discover',
                search,
                filter
            })
        });

        if (!response.ok) {
            throw new Error('No se encontraron coincidencias');
        }
        
        const receiveData = await response.json();
        
        removeLoader();
        
        renderDiscoverOrganizations(receiveData.data);
        console.log(receiveData);

    } catch (error) {
      console.error('Error:', error.message);
    }
}

function renderDiscover() {
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="search-main">
                            <div class="search-title">
                                <img src="assets/icons/destellos.png" alt="detellos" class="search-flashes">
                                <h1><span class="home-cover_title-red">Busca</span> protectoras</h1>
                                <h4>Busca y filtra por  <span class="home-cover_title-red">nombre</span> de protectora u organización</h4>
                                <img src="assets/icons/flecha.png" alt="flecha" class="search-arrow">
                            </div>
                            <div class="search-container">
                                <div class="search-container_input">
                                    <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" class="search-icon" alt="Lupa">
                                    <input id="searchInput" type="text" placeholder="Buscar...">
                                    <button id="searchButton">Buscar</button>
                                </div>
                                <div class="search-container_filter">
                                    <ul>
                                        <li class="search-filter order-filter" id="orderFilterAsc">Orden ASC</li>
                                        <li class="search-filter" id="dogFilter">Perros</li>
                                        <li class="search-filter" id="catFilter">Gatos</li>
                                        <li class="search-filter" id="exoticFilter">Exóticos</li>
                                        <li class="search-filter" id="madridFilter">Madrid</li>
                                    </ul>
                                </div>
                                <div class="search-container_results"></div>
                                <div class="paginator">
                                    <button><</button>
                                    <ul>
                                        <li class="pag-selected">1</li>
                                        <li>2</li>
                                        <li>3</li>
                                        <li>4</li>
                                        <li>5</li>
                                        <li>6</li>
                                    </ul>
                                    <button>></button>
                                </div>`;

    main.innerHTML= HTMLcontent;

    discover('', []);
}

function renderDiscoverOrganizations(organizations) {
    let organizationContainer = document.querySelector('.search-container_results');
    let organizationsHTML = '';

    for (let key in organizations) {
        const currentOrganization = organizations[key];

        let dogsCount = 0;
        let exoticsCount = 0;
        let catsCount = 0;

        currentOrganization.species.forEach(specie => {
            
            switch (specie.name) {
                case 'Perro':
                    dogsCount = specie.count;
                    break;

                case 'Exótico':
                    exoticsCount = specie.count;
                    break;

                case 'Gato':
                    catsCount = specie.count;
                    break;
            }
        });

        organizationsHTML += `<div class="search-container_results-box">
                                <h2>${currentOrganization.name}</h2>
                                <div class="box-location">
                                    <img src="assets/icons/Subtract.png" alt="ubicacion">
                                    <p>${currentOrganization.location}</p>
                                </div>
                                <button>Ver perfil</button>
                                <div class="box-data_animals">
                                    <div class="animal-item">
                                        <p>${dogsCount}</p>
                                        <img src="assets/icons/Perro.svg" alt="perro">
                                    </div>
                                    <div class="animal-item">
                                        <p>${exoticsCount}</p>
                                        <img src="assets/icons/Raton.svg" alt="raton">
                                    </div>
                                    <div class="animal-item">
                                        <p>${catsCount}</p>
                                        <img src="assets/icons/Gato.svg" alt="gato">
                                    </div>
                                </div>
                            </div>`;
    }

    organizationContainer.innerHTML= organizationsHTML;
}

function selectedFilters() {
    const searchFilters = document.querySelectorAll('.search-filter');
    let filtersSelected = [];

    searchFilters.forEach(filter => {
        if (filter.classList.contains('selected')) {
            filtersSelected.push(filter.id);
        }
    });

    return filtersSelected;
}

let currentSearchText = '';
let currentFilters = [];
document.addEventListener('click', (e) => {

    if (e.target.id === 'searchButton') {
        currentSearchText = document.querySelector('#searchInput').value;
        discover(currentSearchText, currentFilters);
    }

    if (e.target.classList.contains('search-filter')) {

        if (e.target.classList.contains('order-filter')) {
            e.target.innerText = (e.target.innerText == 'Orden ASC') ? 'Orden DESC' : 'Orden ASC';
            e.target.id = (e.target.id == 'orderFilterAsc') ? 'orderFilterDesc' : 'orderFilterAsc';
        }
        
        e.target.classList.toggle('selected');
        currentFilters = selectedFilters();
        discover(currentSearchText, currentFilters);
    }
});