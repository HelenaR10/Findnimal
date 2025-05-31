async function login(email, password) {
    const errorMessage = document.querySelector('.form-input .error-message');

    try {
      const response = await fetch('../backend/controllers/authController.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: 'login',
            email,
            password
        })
      });

      if (!response.ok) {
        throw new Error('Error en la autenticación');
      }

      errorMessage.style.display = 'none';

      const receiveData = await response.json();

      localStorage.setItem('token', receiveData.data.token);

      renderMain();

    } catch (error) {
      console.error('Error:', error.message);
      errorMessage.style.display = 'block';
    }
}

function logout() {
    localStorage.clear();
    renderMain();
}

function renderLogin() {
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="login-main">
                            <div class="login-container">
                                <h1>¡Bienvenid@ de nuevo!</h1>
                                <form class="login-form" id="loginForm">
                                    <div class="form-input">
                                        <label for="email">Email</label>
                                        <input type="email" id="loginEmail" required>
                                    </div>
                                    <div class="form-input">
                                        <label for="password">Contraseña</label>
                                        <input type="password" id="loginPassword" required>
                                        <p class="error-message">Usuario o contraseña incorrectos</p>
                                    </div>
                                    <!-- <div class="remember-input">
                                        <input type="checkbox" class="checkbox-input">
                                        <p>Recuérdame</p>
                                    </div> -->
                            
                                    <button type="submit" id="loginButton">Entrar</button>
                                </form>
                            
                                <h3>¿Has perdido a tu amigo?</h3>
                                <div class="lost-form">
                                    <img src="assets/icons/login-arrow.svg" alt="">
                                    <p class="help-here">Te ayudamos a encontrarle</p>
                                </div>
                                <div class="register-form">
                                    <p>¿Aún no eres de los nuestros?</p>
                                    <p class="register-here">Regístrate aquí</p>
                                </div>
                            </div>
                        </div>`;

    main.innerHTML= HTMLcontent;
}

document.addEventListener('click', (e) => {
    switch (true) {
        case e.target.classList.contains('register-here'):
            renderRegister();
            renderFooter();
            changeHeaderColor('transparent');
            break;

        case e.target.classList.contains('help-here'):
            renderFindForm();
            renderFooter();
            changeHeaderColor('var(--color-green)');
            break;
    }
});

document.addEventListener('submit', (e) => {
    e.preventDefault();
    let userEmail;
    let userPassword;

    if (e.target.id === 'loginForm') {
        const loginForm = e.target;
        userEmail = loginForm.querySelector('#loginEmail').value;
        userPassword = loginForm.querySelector('#loginPassword').value;

        if (userEmail && userPassword) {
            login(userEmail, userPassword);
        }
    }
});