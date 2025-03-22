function renderLogin() {
    const main = document.querySelector('main');

    const HTMLcontent = `<main class="login-main">
                        <div class="login-container">
                            <h1>¡Bienvenid@ de nuevo!</h1>
                            <form action="" class="login-form">
                                <div class="form-input">
                                    <label for="email">Email</label>
                                    <input type="email">
                                </div>
                                <div class="form-input">
                                    <label for="password">Contraseña</label>
                                    <input type="password">
                                </div>
                                <!-- <div class="remember-input">
                                    <input type="checkbox" class="checkbox-input">
                                    <p>Recuérdame</p>
                                </div> -->
                        
                                <button>Entrar</button>
                            </form>
                        
                            <h3>¿Has encontrado un animal perdido?</h3>
                            <div class="lost-form">
                                <img src="assets/icons/login-arrow.svg" alt="">
                                <a href="form.html">Ayúdale a encontrar su hogar</a>
                            </div>
                            <div class="register-form">
                                <p>¿Aún no eres de los nuestros?</p>
                                <a href="register.html">Regístrate aquí</a>
                            </div>
                        </div>
                    </main>`;
    main.innerHTML= HTMLcontent;
}