function renderRegister() {
    const main = document.querySelector('main');

    const HTMLcontent = `<main class="register-main">
                    <form action="" class="register-container">
                        <h1>Registro</h1>
                
                        <div class="form-input">
                            <label for="name">Nombre</label>
                            <input type="text">
                        </div>
                        <div class="form-input">
                            <label for="surname">Apellidos</label>
                            <input type="text">
                        </div>
                        <div class="form-input">
                            <label for="email">Email</label>
                            <input type="email">
                        </div>
                        <div class="form-input">
                            <label for="phone">Teléfono</label>
                            <input type="number">
                        </div>
                        <div class="form-input">
                            <label for="password">Contraseña</label>
                            <input type="password">
                        </div>
                        <div class="form-input">
                            <label for="password">Repite la contraseña</label>
                            <input type="password">
                        </div>
                        <button>Registrarme</button>
                    </form>
                </main>`;
    main.innerHTML= HTMLcontent;
}