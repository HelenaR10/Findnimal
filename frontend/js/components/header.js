function renderHeader() {
    const header = `<header>
                        <nav>
                            <ul class="navbar">
                                <img src="assets/logo.svg" alt="logo" class="nav-logo">
                                </div>
                                <li class="nav-item" id="home-navbar">Inicio</li>
                                <li class="nav-item" id="discover-navbar">Descubre</li>
                                <li class="nav-item" id="rescue-navbar">Rescata</li>
                                <li class="nav-item" id="find-navbar">Encuentra</li>
                                <li class="nav-item" id="profile-navbar">Perfil</li>
                                <button class="nav-button">Adopta</button>
                            </ul>
                        </nav>
                    </header>`;
    return header;
}

function changeHeaderColor(color) {
    const header = document.querySelector('header');

    header.style.backgroundColor = color;
}

document.addEventListener('click', (e) => {

    switch (true) {
        case e.target.id === 'home-navbar':
            renderHome();
            renderFooter();
            changeHeaderColor('var(--color-orange)');
            break;

        case e.target.id === 'discover-navbar':
            renderDiscover();
            renderFooter();
            changeHeaderColor('var(--color-blue)');
            break;

        case e.target.id === 'rescue-navbar':
            renderRescueForm();
            renderFooter();
            changeHeaderColor('var(--color-green)');
            break;

        case e.target.id === 'find-navbar':
            renderFindForm();
            renderFooter();
            changeHeaderColor('var(--color-green)');
            break;

        case e.target.id === 'profile-navbar':
            renderProfile();
            renderFooter();
            changeHeaderColor('var(--color-blue)');
            break;
    }
});