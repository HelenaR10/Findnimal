async function saveAnimalUserData(findForm) {
    const formData = new FormData(findForm);
    
    formData.append('endpoint', 'saveAnimalUserData');

    const authToken = getAuthToken();
    const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

        try {
            const response = await fetch('../backend/controllers/findController.php', {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (response.status === 401) {
                logout();
                alert('Sesión expirada, inicia sesión');
            }

            if (!response.ok) {
                alert('Error al guardar tus datos');
                throw new Error('No se encontraron coincidencias');
            }

            const responseData = await response.json();

            if (responseData.data.match) {
                getMatchesData(responseData.data.matches);

            } else {
                alert('Lo sentimos, no se encontraron coincidencias, pero guardamos tus datos y los de tu mascota para que puedas encontrarla en el futuro');
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
}

async function getMatchesData(matches) {
    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/findController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                endpoint: 'getMatchesData',
                matches: matches
            })
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
        }

        if (!response.ok) {
            throw new Error('No se encontraron coincidencias');
        }
        
        const receiveData = await response.json();
        renderAnimalMatchesModal(receiveData.data);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function renderFindForm() {
    const main = document.querySelector('main');
    const speciesBreedsData = await getSpeciesAndBreedsData();
    const seenSpecies = new Set();

    const userData = `<h4>Tus datos</h4>
                        <div class="main-form_item-top">
                            <div class="main-form_item">
                                <label for="name">Nombre</label>
                                <input type="text" name="name" required  id="findFormName">
                            </div>
                            <div class="main-form_item">
                                <label for="surname">Apellidos</label>
                                <input type="text" name="surname" required id="findFormSurname">
                            </div>
                            <div class="main-form_item">
                                <label for="email">Email</label>
                                <input type="email" name="email" required id="findFormEmail">
                            </div>
                            <div class="main-form_item phone-input">
                                <label for="phone">Teléfono</label>
                                <input type="number" name="phone" required id="findFormPhone">
                                <p class="error-message">Introduce un teléfono válido (9 cifras)</p>
                            </div>
                        </div>`;

    const isAuth = checkAuth() ? '' : userData;

    let HTMLcontent = `<div class="find-main">
                            <div class="form-page">
                                <div class="form-title">
                                    <img src="assets/icons/destellos.png" alt="destellos" class="flashes-form">
                                    <h1><span class="home-cover_title-red">Encuentra a</span> tu mascota</h1>
                                    <h3>Rellena nuestro formulario y te ayudaremos a encontrar a tu amigo</h3>
                                    <img src="assets/icons/flecha.png" alt="flecha" class="arrow-form">
                                </div>
                                <form class="main-form" id="findForm">
                                    ${isAuth}
                                    <h4>Datos del animal</h4>
                                    <div class="main-form_item-top">
                                        <div class="main-form_item">
                                            <label for="specie">Especie</label>
                                            <select name="specie" id="findFormSpecie" name="specie" required>
                                                <option value="" disabled selected>Elige una especie</option>`;

    speciesBreedsData.forEach(element => {
        if (!seenSpecies.has(element.specie_name)) {
            seenSpecies.add(element.specie_name);
            HTMLcontent += `<option value="${element.specie_id}">${element.specie_name}</option>`;
        }
    });
                                            
    HTMLcontent += `</select>
                </div>
                <div class="main-form_item">
                    <label for="breed">Raza</label>
                    <select name="breed" id="findFormBreed" name="breed" required>
                        <option value="" disabled selected>Elige una raza</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="hair">Color del pelo</label>
                    <select name="hair" required>
                        <option value="" disabled selected>Elige un color de pelo</option>
                        <option value="1">Negro</option>
                        <option value="2">Blanco</option>
                        <option value="3">Marrón</option>
                        <option value="4">Gris</option>
                        <option value="5">Varios colores</option>
                        <option value="5">Otros</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="eyes">Color de ojos</label>
                    <select name="eyes" required>
                        <option value="" disabled selected>Elige un color de ojos</option>
                        <option value="1">Marrón</option>
                        <option value="2">Verde</option>
                        <option value="3">Azul</option>
                        <option value="4">Rojo</option>
                        <option value="5">Negro</option>
                        <option value="6">Amarillo</option>
                        <option value="7">Gris</option>
                        <option value="8">Heterocromía</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="size">Tamaño</label>
                    <select name="size" required>
                        <option value="" disabled selected>Elige un tamaño</option>
                        <option value="1">Enano</option>
                        <option value="2">Pequeño</option>
                        <option value="3">Mediano</option>
                        <option value="4">Grande</option>
                        <option value="5">Gigante</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="age">Edad aproximada</label>
                    <select name="age" required>
                        <option value="" disabled selected>Elige una edad</option>
                        <option value="1">Cría</option>
                        <option value="2">Junior</option>
                        <option value="3">Adulto</option>
                        <option value="4">Senior</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="sex">Sexo</label>
                    <select name="sex" required>
                        <option value="" disabled selected>Elige el género</option>
                        <option value="1">Hembra</option>
                        <option value="2">Macho</option>
                    </select>
                </div>
                <div class="main-form_item">
                    <label for="identification">Identificación</label>
                    <select name="identification" required>
                        <option value="" disabled selected>Elige una opción</option>
                        <option value="1">Con collar</option>
                        <option value="2">Sin collar</option>
                    </select>
                </div>
            </div>
            <div class="main-form_item-bottom">
                <div class="main-form_item">
                    <label for="decription">Descripción</label>
                    <textarea placeholder="Estado de salud, lugar del encuentro, algo que creas destacable..." name="description" required></textarea>
                </div>
                <div class="main-form_item">
                    <label for="animal photo">Foto del animal</label>
                    <input type="file" name="image" required>
                </div>
            </div>
            <button type="submit">Guardar</button>
        </form>
    </div>
</div>`;

    main.innerHTML= HTMLcontent;

    const specieSelect = document.getElementById('findFormSpecie');
    const breedSelect = document.getElementById('findFormBreed');

    specieSelect.addEventListener('change', (e) => {
        const selectedSpecieId = e.target.value;
        let breedOptions = '';

        speciesBreedsData.forEach(element => {
            if (element.specie_id == selectedSpecieId) {
                breedOptions += `<option value="${element.breed_id}">${element.breed_name}</option>`;
            }
        });

        breedSelect.innerHTML = breedOptions;
    });
}

async function renderAnimalMatchesModal(matches) {
    console.log(matches);

    let mactchesModal = `<div class="matches-modal-container">
                            <div class="matches-modal">
                                <div class="matches-modal_title">
                                    <h1>¡Has hecho match!</h1>
                                    <p>En nuestra base de datos hemos encontrado un animal que coincide con el que estás buscando</p>
                                </div>
                                <div class="matches-container">`;

    matches.forEach(match => {
        mactchesModal += `<div class="animal-match" id="${match.animalMatchId}" data-sender-user-id="${match.senderUserId}" data-user-name="${match.userName}" data-user-surname="${match.userSurname}" data-user-email="${match.userEmail}" data-user-phone="${match.userPhone}">
                                <div class='animal-match_img'>
                                    <img src="${match.animalImage}" alt="${match.animalName}">
                                </div>
                                <div class="animal-match_contain">
                                    <h2>${match.animalName}</h2>
                                    <p>Se trata de un adorable ${match.specie} ${match.sex} de raza ${match.breed}. Es un ejemplar ${match.age}.</p>
                                </div>
                                <div class="animal-match_buttons">
                                    <button class="animal-match_button-green">Es mi mascota</button>
                                    <button class="animal-match_button-red">No es mi mascota</button>
                                </div>
                            </div>`;
    });

    mactchesModal += `</div>
                    <button class="close-matches-modal">Cerrar</button>
                    </div>
                        </div>`;

    document.body.insertAdjacentHTML('afterBegin', mactchesModal);
}

document.addEventListener('submit', async(e) => {
    e.preventDefault();

    switch (e.target.id) {

        case 'findForm':
            const findAnimalForm = e.target;

            // if (checkAuth()) {
            //     const userPhone = findAnimalForm.querySelector('#findFormPhone').value;
            //     const phoneErrorMessage = findAnimalForm.querySelector('.phone-input p');
            //     const phoneRegex = /^\d{9}$/;
            //     const isPhoneValid = phoneRegex.test(userPhone);

            //     phoneErrorMessage.style.display = (isPhoneValid) ? 'none' : 'block';

            //     if (!isPhoneValid) {
            //         return;
            //     }
            // }
            
            await saveAnimalUserData(findAnimalForm);
            break;
    }
});

document.addEventListener('click', async(e) => {
    if (e.target.classList.contains('animal-match_button-green')) {
        alert('¡Has encontrado a tu mascota! Estos son los datos de contacto de la persona/organización que la encontró: \n\n' +
                'Nombre: ' + e.target.closest('.animal-match').dataset.userName + ' ' + e.target.closest('.animal-match').dataset.userSurname + '\n' +
                'Email: ' + e.target.closest('.animal-match').dataset.userEmail + '\n' +
                'Teléfono: ' + e.target.closest('.animal-match').dataset.userPhone + '\n' + 
                'También se notificará a la persona/organización que encontró a tu mascota'
            );

        const animalId = e.target.closest('.animal-match').id;
        const senderUserId = e.target.closest('.animal-match').dataset.senderUserId;
        saveNotification(animalId, senderUserId); 
        

    } else if (e.target.classList.contains('animal-match_button-red')) {
        if (confirm('Si pulsas en "No es mi mascota" eliminaremos esta coincidencia')) {
            e.target.closest('.animal-match').remove();
        }
    } else if (e.target.classList.contains('close-matches-modal')) {
        document.querySelector('.matches-modal-container').remove();
    }
});
    