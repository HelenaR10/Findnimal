function renderProfile() {
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="profile-main"
                            <div class="blur">
                                <div class="profile-data">
                                    <div class="profile-data_person">
                                        <!-- <img src="assets/icons/destellos.png" alt="destellos" class="flashes-profile"> -->
                                        <h1>Hola, <span class="home-cover_title-red">Protectora</span></h1>
                                        <div class="data_person_img">
                                            <img src="assets/img-ej.JPG" alt="person">
                                        </div>
                                        <h3>Protectora de animales</h3>
                                        <div class="localization-person">
                                            <img src="assets/icons/Subtract.png" alt="localizacion">
                                            <h4>localizacion</h4>
                                        </div>
                                    </div>
                        
                                    <div class="profile-data_animals">
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
                        
                                    <div class="profile-data_buttons">
                                        <button>Editar perfil</button>
                                        <button><img src="assets/icons/" alt="settings"></button>
                                        <button>Ver buzón</button>
                                    </div>
                                </div>
                        
                                <div class="profile-pics">
                                    <div class="profile-pics_filter">
                                        <ul>
                                            <li>Todo</li>
                                            <li>Gatos</li>
                                            <li>Perros</li>
                                            <li>Exóticos</li>
                                        </ul>
                                    </div>
                                    <div class="profile-pics_container">
                                        <div class="profile-pics_item add-pic">
                                            <p>+</p>
                                        </div>
                                        <div class="profile-pics_item">
                                            <img src="" alt="">
                                        </div>
                                        <div class="profile-pics_item">
                                            <img src="" alt="">
                                        </div>
                                        <div class="profile-pics_item">
                                            <img src="" alt="">
                                        </div>
                                        <div class="profile-pics_item">
                                            <img src="" alt="">
                                        </div>
                                        <div class="profile-pics_item">
                                            <img src="" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="profile-edit hidden">
                                <div class="profile-edit_title">
                                    <img src="assets/icons/destellos.png" alt="destellos" class="flashes-profile">
                                    <h1>Editar perfil</h1>
                                </div>
                                <div class="profile-edit_photo">
                                    <img src="assets/img-ej.JPG" alt="">
                                <!--logo camara-->
                                </div>
                                <form action="">
                                    <div class="form-input">
                                        <label for="name">Nombre</label>
                                        <input type="text">
                                    </div>
                                    <div class="form-input">
                                        <label for="surname">Apellidos</label>
                                        <input type="text">
                                    </div>
                                    <div class="form-input">
                                        <label for="text">Ubicación</label>
                                        <input type="ubicacion">
                                    </div>
                                    <div class="form-input">
                                        <label for="phone">Tipo de perfil</label>
                                        <select name="profile-type" id="profileType">
                                            <option value="animals-asociation">Protectora de animales</option>
                                            <option value="person">Particular</option>
                                        </select>
                                    </div>
                                    <div class="profile-edit_button">
                                        <img src="assets/icons/flecha.png" alt="arrow">
                                        <button>Editar</button>
                                    </div>
                                </form>
                            </div>
                            <div class="post-create hidden">
                        
                            </div>
                        </div>`;

    // main.classList.remove();
    // main.classList.add('profile-main');
    main.innerHTML= HTMLcontent;
}