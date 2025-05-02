function renderHeader(isAuth) {
    let buttonText = isAuth ? 'perfil' : 'login';
    let longinLinks = `<li class="nav-item" id="rescue-navbar">Rescata</li>
                        <li class="logout-item" id="logout-navbar">Logout</li>`;
    
    const header = `<header>
                        <nav>
                            <ul class="navbar">
                                <img src="assets/logo.svg" alt="logo" class="nav-logo">
                                <li class="nav-item" id="home-navbar">Inicio</li>
                                <li class="nav-item" id="discover-navbar">Descubre</li>
                                <li class="nav-item" id="find-navbar">Encuentra</li>
                                ${isAuth ? longinLinks : ''}
                                <button class="nav-button nav-item" id="${buttonText}-navbar">${buttonText}</button>
                            </ul>
                        </nav>
                    </header>`;
    return header;
}

function changeHeaderColor(color) {
    const header = document.querySelector('header');
    header.style.backgroundColor = color;
}

document.addEventListener('click', async (e) => {

    const navItems = document.querySelectorAll('.nav-item');    

    if (e.target.matches('.nav-item')) {
        navItems.forEach(item => item.classList.remove('menu-active'));
        e.target.classList.add('menu-active');
    }

    switch (true) {
        case e.target.id === 'home-navbar':
            changeHeaderColor('var(--color-orange)');
            renderHome();
            renderFooter();

            break;

        case e.target.id === 'discover-navbar':
            changeHeaderColor('var(--color-blue)');
            renderDiscover();
            renderFooter();
            break;

        case e.target.id === 'find-navbar':
            renderFindForm();
            renderFooter();
            changeHeaderColor('var(--color-green)');
            break;
        
        case e.target.id === 'rescue-navbar':
            renderRescueForm();
            renderFooter();
            changeHeaderColor('var(--color-green)');
            break;

        case e.target.id === 'perfil-navbar':
            await renderProfile();
            renderFooter();
            changeHeaderColor('var(--color-violet)');
            break;
            
        case e.target.id === 'login-navbar':
            document.body.classList.add('navbar-forms');
            renderLogin();
            renderFooter();
            changeHeaderColor('transparent');
            break;
            
        case e.target.id === 'register-navbar':
            document.body.classList.add('navbar-forms');
            renderRegister();
            renderFooter();
            changeHeaderColor('transparent');
            break;

        case e.target.id === 'logout-navbar':
            logout();
            break;
    }
});