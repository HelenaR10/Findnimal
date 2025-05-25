async function register(userData) {
    try {
      const response = await fetch('../backend/controllers/authController.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: 'register',
            ...userData,
        })
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const receiveData = await response.json();

      localStorage.setItem('token', receiveData.data.token);

      alert('Registro exitoso');
      renderMain();

    } catch (error) {
      console.error('Error:', error.message);
    }
}

function renderRegister() {
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="register-main">
                            <form class="register-container" id="registerForm">
                                <h1>Registro</h1>
                        
                                <div class="form-input">
                                    <label for="name">Nombre</label>
                                    <input type="text" id="registerName" required>
                                </div>
                                <div class="form-input">
                                    <label for="surname">Apellidos</label>
                                    <input type="text" id="registerSurname">
                                </div>
                                <div class="form-input email-input">
                                    <label for="email">Email</label>
                                    <input type="email" id="registerEmail" required>
                                </div>
                                <div class="form-input phone-input">
                                    <label for="phone">Teléfono</label>
                                    <input type="tel" id="registerPhone" required>
                                    <p class="error-message">Introduce un teléfono válido (9 cifras)</p>
                                </div>
                                <div class="form-input role-input">
                                    <label for="role">Tipo de perfil</label>
                                    <select id="registerRole" required>
                                        <option value="" disabled selected required>Elige el tipo de perfil</option>
                                        <option value="1">Usuario</option>
                                        <option value="2">Organización</option>
                                    </select>
                                    <p class="error-message">Introduce un tipo de usuario válido</p>
                                </div>
                                <div class="form-input password-input">
                                    <label for="password">Contraseña</label>
                                    <input type="password" id="registerPassword" required>
                                    <p class="error-message">Debe tener entre 8-16 caracteres e incluir al menos una mayúscula, un número y un caracter especial</p>
                                </div>
                                <div class="form-input repeat-password-input">
                                    <label for="password">Repite la contraseña</label>
                                    <input type="password" id="registerRepeatedPassword" required>
                                    <p class="error-message">Las contraseñas deben coincidir</p>
                                </div>
                                <button type="submit" id="registerButton">Registrarme</button>
                            </form>
                        </div>`;

    main.innerHTML= HTMLcontent;
}

document.addEventListener('submit', (e) => {
    e.preventDefault();
    let userName;
    let userSurname;
    let userEmail;
    let userPhone;
    let userPassword;
    let userRepeatedPassword;
    let userRole;

    if (e.target.id === 'registerForm') {
        const registerForm = e.target;
        userName = registerForm.querySelector('#registerName').value;
        userSurname = registerForm.querySelector('#registerSurname').value;
        userEmail = registerForm.querySelector('#registerEmail').value;
        userPhone = parseInt(registerForm.querySelector('#registerPhone').value);
        const phoneErrorMessage = registerForm.querySelector('.phone-input p');
        userPassword = registerForm.querySelector('#registerPassword').value;
        const passwordErrorMessage = registerForm.querySelector('.password-input p');
        userRepeatedPassword = registerForm.querySelector('#registerRepeatedPassword').value;
        const repitedPassErrorMessage = registerForm.querySelector('.repeat-password-input p');
        userRole = registerForm.querySelector('#registerRole').value;

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        const phoneRegex = /^\d{9}$/;

        const isPhoneValid = phoneRegex.test(userPhone);
        const isPassValid = passwordRegex.test(userPassword);
        const arePassEquals = userPassword === userRepeatedPassword;

        phoneErrorMessage.style.display = (isPhoneValid) ? 'none' : 'block';
        passwordErrorMessage.style.display = (isPassValid) ? 'none' : 'block';
        repitedPassErrorMessage.style.display = (arePassEquals) ? 'none' : 'block';
        
        if (isPhoneValid && isPassValid && arePassEquals) {
            const userData = {
                name: userName,
                surname: userSurname,
                phone: userPhone,
                email: userEmail,
                password: userPassword,
                role: userRole
            }
            
            register(userData);
        }
    }
});