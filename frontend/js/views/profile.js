async function getProfile() {
    showLoader();

    const token = getAuthToken();

        try {
            const response = await fetch('../backend/controllers/profileController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    endpoint: 'getProfileData',
                })
            });

            if (response.status === 401) {
                logout();
                alert('Sesión expirada, inicia sesión');
            }

            if (!response.ok) {
                alert('No se encontraron coincidencias');
                throw new Error('No se encontraron coincidencias');
            }
            
            const receiveData = await response.json();
            removeLoader();
            return receiveData.data;

        } catch (error) {
            console.error('Error:', error.message);
        }
}

async function getAllPosts() {

    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                endpoint: 'getAllPosts',
            })
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
        }

        if (!response.ok) {
            alert('No se encontraron coincidencias');
            throw new Error('No se encontraron coincidencias');
        }
        
        const receiveData = await response.json();

        return receiveData.data;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getSpeciesAndBreedsData() {
    
    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: 'getSpeciesAndBreedsData',
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

        return receiveData.data;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function editProfile(profileForm) {
    const formData = new FormData(profileForm);
    formData.append('endpoint', 'editProfile');
    formData.append('userImage', profileForm.dataset.userImage);

    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
            return;
        }

        if (!response.ok) {
            alert('Error al guardar tus datos');
            throw new Error('Error al guardar los datos');
        }
        
        alert('Datos actualizados correctamente');
        const receiveData = await response.json();
        const formContainer = document.querySelector('.profile-form_container');
        if (formContainer) {
            formContainer.remove();
        }
        await renderProfile();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getMailbox() {
    
    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                endpoint: 'getMailBoxData',
            })
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
        }

        if (!response.ok) {
            alert('No se encontraron coincidencias');
            throw new Error('No se encontraron coincidencias');
        }
        
        const receiveData = await response.json();
        return receiveData.data;

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function deleteNotification(notificationId) {
    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                endpoint: 'deleteNotification',
                notificationId: notificationId
            })
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
        }

        if (!response.ok) {
            alert('Error al eliminar la notificación');
            throw new Error('Error al eliminar la notificación');
        }
        
        alert('Notificación eliminada correctamente');
        const receiveData = await response.json();
        const formContainer = document.querySelector('.profile-form_container');
        formContainer.remove()
        renderMailbox();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function createPost(postForm) {
    showLoader();
    
    const formData = new FormData(postForm);
    formData.append('endpoint', 'createPost');

    const token = getAuthToken();

        try {
            const response = await fetch('../backend/controllers/profileController.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.status === 401) {
                logout();
                alert('Sesión expirada, inicia sesión');
            }

            if (!response.ok) {
                alert('Error al crear el post');
                throw new Error('Error al crear el post');
            }
            
            alert('Post creado correctamente');
            const receiveData = await response.json();

            document.querySelector('.profile-form_container').remove();
            removeLoader();
            renderProfile();

        } catch (error) {
            console.error('Error:', error.message);
        }
}

async function editPost(postForm) {
    const formData = new FormData(postForm);
    formData.append('endpoint', 'editPost');
    formData.append('postId', postForm.dataset.postId);
    formData.append('animalId', postForm.dataset.animalId);
    formData.append('animalImageName', postForm.dataset.animalImageName);

    const token = getAuthToken();

    try {
        const response = await fetch('../backend/controllers/profileController.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.status === 401) {
            logout();
            alert('Sesión expirada, inicia sesión');
            return;
        }

        if (!response.ok) {
            alert('Error al editar el post');
            throw new Error('Error al editar el post');
        }
        
        alert('Post actualizado correctamente');
        const receiveData = await response.json();
        const formContainer = document.querySelector('.profile-form_container');
        if (formContainer) {
            formContainer.remove();
        }
        await renderProfile();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function deletePost(animalId) {

    const token = getAuthToken();

        try {
            const response = await fetch('../backend/controllers/profileController.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    endpoint: 'deletePost',
                    animalId: animalId
                })
            });

            if (response.status === 401) {
                logout();
                alert('Sesión expirada, inicia sesión');
            }

            if (!response.ok) {
                alert('Error al eliminar el post');
                throw new Error('Error al eliminar el post');
            }
            
            alert('Post eliminado correctamente');
            const receiveData = await response.json();

            renderProfile();

        } catch (error) {
            console.error('Error:', error.message);
        }
}

async function renderProfile() {
    const userData = await getProfile();
    const postsData = await getAllPosts();
    const main = document.querySelector('main');

    let HTMLcontent = '<div class="profile-main">';

        let roleName = (userData.role === 2) ? 'Protectora de animales' : 'Usuario';

        HTMLcontent += `<div class="profile-data_person">
                            <!-- <img src="assets/icons/destellos.png" alt="flashes" class="flashes-profile"> -->
                            <h1>Hola, <span class="home-cover_title-red">${userData.userName}</span></h1>
                            <div class="data_person_img">
                                <img src="${userData.image || 'assets/img-ej.JPG'}" alt="image profile">
                            </div>
                            <h3>${roleName}</h3>
                            <div class="localization-person">
                                <img src="assets/icons/Subtract.png" alt="location">
                                <h4>${userData.location}</h4>
                            </div>
                        </div>

                        <div class="profile-data_animals">
                            <div class="animal-item">
                                <p>${userData.dogsCount}</p>
                                <img src="assets/icons/Perro.svg" alt="dogs">
                            </div>
                            <div class="animal-item">
                                <p>${userData.exoticsCount}</p>
                                <img src="assets/icons/Raton.svg" alt="exotics">
                            </div>
                            <div class="animal-item">
                                <p>${userData.catsCount}</p>
                                <img src="assets/icons/Gato.svg" alt="cats">
                            </div>
                        </div>
            
                        <div class="profile-data_buttons">
                            <button id="editProfileButton">Editar perfil</button>
                            <div class="settings-icon">
                                <img src="assets/icons/settings-icon.svg" alt="settings">
                            </div>
                            <button id="showMailboxButton">Ver buzón</button>
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
                                <div class="profile-pics_item add-post-button">
                                    <p id="createPostButton">+</p>
                                </div>`;

        postsData.forEach(post => {
            HTMLcontent += `<div class="profile-pics_item" data-value="${post.post_id}">
                                <img src="${post.animal_image}" alt="${post.name}" class="animal-image" data-animal-id="${post.animal_id}">
                                <div class="pics_item-buttons">
                                    <img src="assets/icons/edit-icon.svg" alt="edit-icon" class="action-icon edit-post-button">
                                    <img src="assets/icons/eye-icon.svg" alt="edit-icon" class="action-icon show-post-button">
                                    <img src="assets/icons/delete-icon.svg" alt="delete-icon" class="action-icon delete-post-button">
                                </div>
                            </div>`;
        });

    HTMLcontent += '</div></div></div>'

    main.innerHTML= HTMLcontent;
}

async function renderEditProfile() {
    const userData = await getProfile();

    let currentRole = userData.role;
    let userImage = userData.image;
    let userSurname = (userData.role === 2) ? 'Organización' : userData.surname;

    const editForm = `<div class="profile-form_container">
                        <div class="profile-form">
                            <div class="profile-form_title">
                                <img src="assets/icons/destellos.png" alt="flashes">
                                <h1>Editar perfil</h1>
                            </div>
                            <form id="editProfileForm">
                                <div class="profile-form_photo">
                                    <div class="profile-form_photo-img">
                                        <img src="${userImage}" alt="${userData.userName}" id="profileImage" data-user-image="${userImage}">
                                    </div>
                                    <input type="file" name="image">
                                </div>
                                <div class="form-input">
                                    <label for="name">Nombre</label>
                                    <input type="text" id="profileName" name="name" value="${userData.userName}">
                                </div>
                                <div class="form-input">
                                    <label for="surname">Apellidos</label>
                                    <input type="text" id="profileSurname" name="surname" value="${userSurname}">
                                </div>
                                <div class="form-input">
                                    <label for="email">Email</label>
                                    <input type="email" id="profileEmail" name="email" value="${userData.email}">
                                </div>
                                <div class="form-input">
                                    <label for="surname">Teléfono</label>
                                    <input type="number" id="profilePhone" name="phone" name="phone" value="${userData.phone}">
                                </div>
                                <div class="form-input">
                                    <label for="text">Ubicación</label>
                                    <input type="text" id="profileLocation" name="location" value="${userData.location}">
                                </div>
                                <div class="form-input">
                                    <label for="role">Tipo de perfil</label>
                                    <select id="profileType" name="role">
                                        <option value="1">Particular</option>
                                        <option value="2">Protectora de animales</option>
                                    </select>
                                </div>
                                <div class="form-input">
                                    <label for="text">Contraseña</label>
                                    <input type="text" id="profilePass" value="" name="password" placeholder="Dejar vacío si no se modifica">
                                </div>
                                <div class="profile-form_button">
                                    <button class="cancel-button-profile">Cancelar</button>
                                    <button type="submit">Editar</button>
                                </div>
                            </form>
                        </div>`;

    document.body.insertAdjacentHTML('afterBegin', editForm);
    addSelectedElement(currentRole, '#profileType');
}

async function renderMailbox() {
    const mailBoxData = await getMailbox();
    let notifications = '';
    
    mailBoxData.forEach((notification) => {
        notifications += ` <div class="notification-box">
                                <div class="notification" id="${notification.notificationId}">
                                    <div class="notification-img">
                                        <img src="${notification.animalImage}" alt="${notification.senderName}">
                                    </div>
                                    <h3>${notification.senderName}</h3>
                                    <div class="notification-buttons">
                                        <button class="show-notification">Ver</button>
                                        <button class="delete-notification">Eliminar</button>
                                    </div>
                                </div>
                                <div class="hidden-modal">
                                    <p>El usuario ${notification.senderName} ${notification.senderSurname} está interesado en adoptar a ${notification.animalName}.</p>
                                    <p>Puedes contactarlo por:</p>
                                    <ul>
                                        <li>Teléfono: ${notification.senderPhone}</li>
                                        <li>Email: ${notification.senderEmail}</li>
                                    </ul>
                                </div>
                            </div>`;
    });
                            
    let notificationContainer = (mailBoxData.length > 0) ? notifications : '<div class="notification-empty">Tu buzón está vacío</div>';

    const mailBox = `<div class="profile-form_container">
                        <div class="mailbox-container">
                            <div class="mail-title">
                                <h1>Buzón</h1>
                                <p>Aquí puedes ver las personas interesadas en los animales de tu perfil</p>
                            </div>
                            <div class="notifications-container">
                                ${notificationContainer}
                            </div>
                            <button class="cancel-button-profile">Cancelar</button>
                        </div>
                    </div>`;

    document.body.insertAdjacentHTML('afterBegin', mailBox);
}

async function renderCreatePost() {
    const speciesBreedsData = await getSpeciesAndBreedsData();
    const seenSpecies = new Set();


    let createPostForm = `<div class="profile-form_container">
                            <div class="profile-form">
                                <div class="profile-form_title">
                                    <img src="assets/icons/destellos.png" alt="flashes">
                                    <h1>Nuevo post</h1>
                                </div>
                                <form id="createPostForm">
                                    <div class="form-input">
                                        <label for="name">Nombre</label>
                                        <input type="text" id="createPostName" name="name" required>
                                    </div>
                                    <div class="form-input">
                                        <label for="specie">Especie</label>
                                        <select name="specie" id="createPostSpecie" required>
                                            <option value="" disabled selected>Elige una especie</option>`;
    speciesBreedsData.forEach(element => {
        if (!seenSpecies.has(element.specie_name)) {
            seenSpecies.add(element.specie_name);
            createPostForm += `<option value="${element.specie_id}">${element.specie_name}</option>`;
        }
    });

    createPostForm += `</select>
                    </div>
                    <div class="form-input">
                        <label for="breed">Raza</label>
                        <select name="breed" id="createPostBreed" required>
                            <option value="" disabled selected>Elige una raza</option>
                        </select>
                            </div>
                            <div class="form-input">
                                <label for="age">Edad aproximada</label>
                                <select name="age" id="createPostAge" required>
                                    <option value="" disabled selected>Elige una edad</option>
                                    <option value="1">Cría</option>
                                    <option value="2">Junior</option>
                                    <option value="3">Adulto</option>
                                    <option value="4">Senior</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="sex">Sexo</label>
                                <select name="sex" id="createPostSex" required>
                                    <option value="" disabled selected>Elige el género</option>
                                    <option value="1">Hembra</option>
                                    <option value="2">Macho</option>
                                </select>
                            </div>
                            <div class="form-input">
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
                            <div class="form-input">
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
                            <div class="form-input">
                                <label for="size">Tamaño</label>
                                <select name="size" required>
                                    <option value="" disabled selected>Elige una tamaño</option>
                                    <option value="1">Enano</option>
                                    <option value="2">Pequeño</option>
                                    <option value="3">Mediano</option>
                                    <option value="4">Grande</option>
                                    <option value="5">Gigante</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="identification">Identificación</label>
                                <select name="identification" required>
                                    <option value="" disabled selected>Elige una opción</option>
                                    <option value="1">Con collar</option>
                                    <option value="2">Sin collar</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="decription">Descripción</label>
                                <textarea id="createPostDescription" name="description" placeholder="Estado de salud, lugar del encuentro, algo que creas destacable..." required></textarea>
                            </div>
                            <div class="profile-form_file">
                                <label for="animal photo">Foto del animal</label>
                                <input id="createPostImage" name="image" type="file" required>
                            </div>
                            <div class="profile-form_button">
                                <button class="cancel-button-profile">Cancelar</button>
                                <button type="submit">Crear post</button>
                            </div>
                        </form>
                    </div>`;
                    
    document.body.insertAdjacentHTML('afterBegin', createPostForm);

    const specieSelect = document.getElementById('createPostSpecie');
    const breedSelect = document.getElementById('createPostBreed');

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

function addSelectedElement(element, selector) {
    const currentElement = element;
    const selectorContainer = document.querySelector(selector);

    for (let option of selectorContainer) {
        if (option.value == currentElement) {
            option.selected = true;
        }
    }
}

async function renderEditPost(postId) {
    const postsData = await getAllPosts();
    console.log(postsData);
    const currentPost = postsData.find(post => post.post_id == postId);
    const animalId = currentPost.animal_id;
    const animalImageName = currentPost.animal_image;
    const currentAge = currentPost.age_id;
    const currentSex = currentPost.sex_id;
    const currentSpecie = currentPost.specie_id;
    const currentBreed = currentPost.breed_id;
    const currentHair = currentPost.hair_color;
    const currentEyes = currentPost.eye_color;
    const currentSize = currentPost.size;
    const currentIdentification = currentPost.identification;

    const speciesBreedsData = await getSpeciesAndBreedsData();
    const seenSpecies = new Set();

    let editPostForm = `<div class="profile-form_container">
                            <div class="profile-form">
                                <div class="profile-form_title">
                                    <img src="assets/icons/destellos.png" alt="flashes">
                                    <h1>Editar post</h1>
                                </div>
                                <form id="editPostForm" data-post-id="${postId}" data-animal-id="${animalId}" data-animal-image-name="${animalImageName}">
                                    <div class="form-input">
                                        <label for="name">Nombre</label>
                                        <input type="text" name="name" value="${currentPost.name}" required>
                                    </div>
                                    <div class="form-input">
                                        <label for="specie">Especie</label>
                                        <select name="specie" id="editPostSpecie" required>`;
    speciesBreedsData.forEach(element => {
        if (!seenSpecies.has(element.specie_name)) {
            seenSpecies.add(element.specie_name);
            editPostForm += `<option value="${element.specie_id}">${element.specie_name}</option>`;
        }
    });

    editPostForm += `</select>
                    </div>
                    <div class="form-input">
                        <label for="breed">Raza</label>
                        <select name="breed" id="editPostBreed" required>
                        </select>
                            </div>
                            <div class="form-input">
                                <label for="age">Edad aproximada</label>
                                <select name="age" id="editPostAge" required>
                                    <option value="1">Cría</option>
                                    <option value="2">Junior</option>
                                    <option value="3">Adulto</option>
                                    <option value="4">Senior</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="hair">Color del pelo</label>
                                <select name="hair" id="editPostHair" required>
                                    <option value="1">Negro</option>
                                    <option value="2">Blanco</option>
                                    <option value="3">Marrón</option>
                                    <option value="4">Gris</option>
                                    <option value="5">Varios colores</option>
                                    <option value="6">Otros</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="eyes">Color de ojos</label>
                                <select name="eyes" id="editPostEyes" required>
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
                            <div class="form-input">
                                <label for="size">Tamaño</label>
                                <select name="size" id="editPostSize" required>
                                    <option value="1">Enano</option>
                                    <option value="2">Pequeño</option>
                                    <option value="3">Mediano</option>
                                    <option value="4">Grande</option>
                                    <option value="5">Gigante</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="sex">Sexo</label>
                                <select name="sex" id="editPostSex" required>
                                    <option value="1">Hembra</option>
                                    <option value="2">Macho</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <label for="identification">Identificación</label>
                                <select name="identification" id="editPostIdentification" required>
                                    <option value="1">Con collar</option>
                                    <option value="2">Sin collar</option>
                                </select>
                            </div>
                            <div class="form-input">
                                <div class="form-input">
                                    <label for="decription">Descripción</label>
                                    <textarea name="description" required>${currentPost.description}</textarea>
                                </div>
                            </div>
                            <div class="profile-form_file">
                                <label for="editPostImage">Foto del animal</label>
                                <img id="imagePreview" src="${currentPost.animal_image}" alt="${currentPost.name}" />
                                <input id="editPostImage" type="file" name="image">
                            </div>
                            <div class="profile-form_button">
                                <button class="cancel-button-profile">Cancelar</button>
                                <button type="submit">Actualizar</button>
                            </div>
                        </form>
                    </div>`;
                    
    document.body.insertAdjacentHTML('afterBegin', editPostForm);

    const specieSelect = document.getElementById('editPostSpecie');
    const breedSelect = document.getElementById('editPostBreed');
    
    let initialBreedOptions = '';
    speciesBreedsData.forEach(element => {
        if (element.specie_id == currentSpecie) {
            initialBreedOptions += `<option value="${element.breed_id}">${element.breed_name}</option>`;
        }
    });
    
    breedSelect.innerHTML = initialBreedOptions;

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

    addSelectedElement(currentAge, '#editPostAge');
    addSelectedElement(currentSex, '#editPostSex');
    addSelectedElement(currentSpecie, '#editPostSpecie');
    addSelectedElement(currentBreed, '#editPostBreed');
    addSelectedElement(currentHair, '#editPostHair');
    addSelectedElement(currentEyes, '#editPostEyes');
    addSelectedElement(currentSize, '#editPostSize');
    addSelectedElement(currentIdentification, '#editPostIdentification');
}

async function renderShowPost(postId) {
    const postsData = await getAllPosts();

    //notificationButton se gestiona en discover.js
    const interestButton = document.querySelector('.user-profile-main') ? '<button class="interest-button" id="notificationButton">Me interesa</button>' : '';
    const currentPost = postsData.find(post => post.post_id == postId);
    const animalId = currentPost.animal_id;

    let animalImage = (!currentPost.animal_image) ? "assets/img-ej.JPG" : `${currentPost.animal_image}`;

    const animalPost = `<div class="animal-post_container" data-animal-id="${animalId}">
                            <div class="animal-post">
                                <div class="animal-post_img">
                                    <img src="${animalImage}" alt="${currentPost.name}">
                                </div>
                                <div class="animal-post_content">
                                    <h1>${currentPost.name}</h1>
                                    <p>${currentPost.name} es un ${currentPost.specie}, ${currentPost.sex}, de raza ${currentPost.breed} que actualmente está en la etapa de edad de ${currentPost.age}</p>
                                    <p>${currentPost.description}</p>
                                    <div class="animal-post_buttons">
                                        ${interestButton}
                                        <button class="cancel-button-profile">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                            
    document.body.insertAdjacentHTML('afterBegin', animalPost);
}

document.addEventListener('click', async(e) => {
    const formContainer = document.querySelector('.profile-form_container');
    const postContainer = document.querySelector('.animal-post_container');
    let post = '';
    let postId = '';

    switch (e.target.id) {

        case 'editProfileButton':
            await renderEditProfile();
            break;

        case 'showMailboxButton':
            renderMailbox();
            break;
            
        case 'createPostButton':
            renderCreatePost();
            break;
    }

    if (e.target.classList.contains('cancel-button-profile')) {
        formContainer ? formContainer.remove() : postContainer.remove();

    } else if (e.target.classList.contains('show-notification')) {
        const modal = e.target.closest('.notification-box').querySelector('.hidden-modal');
        modal.classList.toggle('show');

    } else if (e.target.classList.contains('delete-notification')) {
        let notification = null;
        if (confirm('¿Seguro que quieres eliminar esta notificación?')) {
            notification = e.target.closest('.notification').id;
            deleteNotification(notification);
        }

    } else if (e.target.classList.contains('edit-post-button')) {
        post = e.target.closest('.profile-pics_item[data-value]');
        postId = post.dataset.value;
        renderEditPost(postId);

    } else if (e.target.classList.contains('show-post-button')) {
        post = e.target.closest('.profile-pics_item[data-value]');
        postId = post.dataset.value;
        renderShowPost(postId);

    } else if (e.target.classList.contains('delete-post-button')) {
        if (confirm('¿Seguro que quieres eliminar este post?')) {
            post = e.target.closest('.profile-pics_item');
            animalId = post.querySelector('.animal-image').dataset.animalId;
            deletePost(animalId);
        }
    }
});

document.addEventListener('submit', async(e) => {
    e.preventDefault();

    switch (e.target.id) {
        case 'createPostForm':
            const createPostForm = e.target;
            await createPost(createPostForm);
            break;

        case 'editPostForm':
            const editPostForm = e.target;
            await editPost(editPostForm);
            break;

        case 'editProfileForm':
            const editProfileForm = e.target;
            await editProfile(editProfileForm);
            break;
    }
});
