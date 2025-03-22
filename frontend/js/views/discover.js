function renderDiscover() {
    const main = document.querySelector('main');

    const HTMLcontent = `<main class="search-main">
        <div class="search-title">
            <img src="assets/icons/destellos.png" alt="detellos" class="search-flashes">
            <h1><span class="home-cover_title-red">Busca</span> protectoras</h1>
            <h4>Busca y filtra por  <span class="home-cover_title-red">especie</span> en caso de animales y por <span class="home-cover_title-red">nombre/ubicación</span> en caso de protectoras</h4>
            <img src="assets/icons/flecha.png" alt="flecha" class="search-arrow">
        </div>
        <div class="search-container">
            <div class="search-container_input">
                <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" class="search-icon" alt="Lupa">
                <input type="text" placeholder="Buscar...">
            </div>
            <div class="search-container_filter">
                <ul>
                    <li class="selected">Orden ASC</li>
                    <li class="selected">Perros</li>
                    <li>Gatos</li>
                    <li>Roedores</li>
                    <li>Aves</li>
                    <li class="selected">Madrid</li>
                </ul>
            </div>
            <div class="search-container_results">
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
                <div class="search-container_results-box">
                    <h2>La camada</h2>
                    <div class="box-location">
                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                        <p>ubicacion</p>
                    </div>
                    <button>Ver perfil</button>
                    <div class="box-data_animals">
                        <div class="animal-item">
                            <p>50</p>
                            <img src="assets/icons/Perro.svg" alt="perro">
                        </div>
                        <div class="animal-item">
                            <p>19</p>
                            <img src="assets/icons/Raton.svg" alt="raton">
                        </div>
                        <div class="animal-item">
                            <p>8</p>
                            <img src="assets/icons/Gato.svg" alt="gato">
                        </div>
                    </div>
                </div>
            </div>
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
            </div>
        </div>
    </main>`;
    main.innerHTML= HTMLcontent;
}