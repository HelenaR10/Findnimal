function renderHome() {
    removeBodyClass();
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="home-main">
                            <div class="home-cover">
                                <div class="home-cover_title">
                                    <img src="assets/icons/destellos.png" alt="destellos" class="flashes-icon">
                                    <h1>¿Has <span class="home-cover_title-red">perdido</span> o <span class="home-cover_title-red">encontrado</span> a un animal?</h1>
                                    <h3>Te ayudamos a buscarle un hogar a todos los animales que lo necesiten</h3>
                                    <img src="assets/icons/flecha.png" alt="flecha" class="arrow-icon">
                                </div>
                                <div class="home-cover_img">
                                    <img src="assets/Imagen header.png" alt="perro">
                                </div>
                            </div>
                            <div class="home-funcionalities">
                                <h2>¿Qué podemos hacer por ti?</h2>
                                <div class="home-funcionalities_items">
                                    <div class="funcionality-container">
                                        <img src="assets/icons/hogar.png" alt="hogar">
                                        <h4>Rescata y encuentra su hogar</h4>
                                        <p>Realiza nuestro formulario ¿Has encontrado un animal? sin necesidad de registro. Nuestro sistema intentará buscar coincidencias en las bases de datos y si no las hay, alertará a la protectora más cercana y os pondrá en contacto para la gestón del animal.</p>
                                    </div>
                                    <div class="funcionality-container">
                                        <img src="assets/icons/Subtract.png" alt="ubicacion">
                                        <h4>Encuentra a tu amigo peludo</h4>
                                        <p>Realiza nuestro formulario ¿Has perdido a tu mascota?.. Guardaremos tus datos y nuestro sistema intentará buscar coincidencias en las bases de datos y si no las hay, alertará a la protectora más cercana y os pondrá en contacto para la gestón del animal.</p>
                                    </div>
                                    <div class="funcionality-container">
                                        <img src="assets/icons/adopta_amigo.png" alt="adopta un amigo">
                                        <h4>Adopta un amigo</h4>
                                        <p>Busca y encuentra a tu próximo compañero de aventuras en nuestra web o permite que otras personas lo encuentren. Contamos con los perfiles de todas las protectoras de Madrid donde se muestran los animales q</p>
                                    </div>
                                    <div class="funcionality-container">
                                        <img src="assets/icons/da_adopcion.png" alt="da en adopción">
                                        <h4>Rescata y encuentra su hogar</h4>
                                        <p>Realiza nuestro formulario ¿Has encontrado un animal? sin necesidad de registro. Nuestro sistema intentará buscar coincidencias en las bases de datos y si no las hay, alertará a la protectora más cercana y os pondrá en contacto para la gestón del animal.</p>
                                    </div>
                                    <div class="funcionality-container">
                                        <img src="assets/icons/busca.png" alt="Busca y encuentra protectoras">
                                        <h4>Busca y encuentra protectoras</h4>
                                        <p> A través de nuestro buscador de protectoras podrás encontrar todas las organizaciones que hay en Madrid.</p>
                                    </div>
                                    <div class="funcionality-container">
                                        <img src="assets/icons/hogar.png" alt="hogar">
                                        <h4>Rescata y encuentra su hogar</h4>
                                        <p>Realiza nuestro formulario ¿Has encontrado un animal? sin necesidad de registro. Nuestro sistema intentará buscar coincidencias en las bases de datos y si no las hay, alertará a la protectora más cercana y os pondrá en contacto para la gestón del animal.</p>
                                    </div>
                                </div>
                            </div> 
                       </div> `;

    main.innerHTML= HTMLcontent;

    const homeMenu = document.querySelector('#home-navbar');
    homeMenu.classList.add('menu-active');
}

function removeBodyClass() {
    const body = document.body;
    if (body.classList) {
        body.classList.remove('navbar-forms');
    }
    changeHeaderColor('var(--color-orange)');
}
