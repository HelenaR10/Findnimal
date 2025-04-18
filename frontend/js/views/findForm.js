function renderFindForm() {
    const main = document.querySelector('main');

    const HTMLcontent = `<div class="find-main">
                            <div class="form-page">
                                <div class="form-title">
                                    <img src="assets/icons/destellos.png" alt="destellos" class="flashes-form">
                                    <h1><span class="home-cover_title-red">Encuentra a</span> tu mascota</h1>
                                    <h3>Rellena nuestro formulario y te ayudaremos a encontrar a tu amigo</h3>
                                    <img src="assets/icons/flecha.png" alt="flecha" class="arrow-form">
                                </div>
                                <div class="main-form">
                                    <div class="main-form_items">
                                        <h4>Tus datos</h4>
                                        <form action="post" class="main-form_item-top">
                                            <div class="main-form_item">
                                                <label for="name">Nombre</label>
                                                <input type="text">
                                            </div>
                                            <div class="main-form_item">
                                                <label for="surname">Apellidos</label>
                                                <input type="text">
                                            </div>
                                            <div class="main-form_item">
                                                <label for="email">Email</label>
                                                <input type="email">
                                            </div>
                                            <div class="main-form_item">
                                                <label for="phone">Teléfono</label>
                                                <input type="number">
                                            </div>
                                        </form>
                                        
                                        <h4>Datos del animal</h4>
                                        <form action="post">
                                            <div class="main-form_item-top">
                                                <div class="main-form_item">
                                                    <label for="specie">Especie</label>
                                                    <select name="specie">
                                                        <option value="dog">Perro</option>
                                                        <option value="cat">Gato</option>
                                                        <option value="bird">Ave</option>
                                                        <option value="rodent">Roedor</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="specie">Raza</label>
                                                    <select name="specie">
                                                        <option value="dog">Perro</option>
                                                        <option value="cat">Gato</option>
                                                        <option value="bird">Ave</option>
                                                        <option value="rodent">Roedor</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="hair">Color del pelo</label>
                                                    <select name="hair">
                                                        <option value="black">Negro</option>
                                                        <option value="white">Blanco</option>
                                                        <option value="gray">Gris</option>
                                                        <option value="brown">Marrón</option>
                                                        <option value="tan">Canela</option>
                                                        <option value="multi">Varios colores</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="eyes">Color de ojos</label>
                                                    <select name="eyes">
                                                        <option value="brown">Marrón</option>
                                                        <option value="green">Verde</option>
                                                        <option value="blue">Azul</option>
                                                        <option value="yellow">Amarillo</option>
                                                        <option value="gray">Gris</option>
                                                        <option value="red">Rojo</option>
                                                        <option value="black">Negro</option>
                                                        <option value="multi">Varios colores</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="size">Size</label>
                                                    <select name="size">
                                                        <option value="xs">Enano</option>
                                                        <option value="s">Pequeño</option>
                                                        <option value="m">Mediano</option>
                                                        <option value="l">Grande</option>
                                                        <option value="xl">Gigante</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="age">Edad aproximada</label>
                                                    <select name="age">
                                                        <option value="baby">Cría</option>
                                                        <option value="junior">Junior</option>
                                                        <option value="adult">Adulto</option>
                                                        <option value="senior">Senior</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="sex">Sexo</label>
                                                    <select name="sex">
                                                        <option value="female">Hembra</option>
                                                        <option value="male">Macho</option>
                                                    </select>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="identification">Identificación</label>
                                                    <select name="identification">
                                                        <option value="dog collar">Con collar</option>
                                                        <option value="dog collar">Sin collar</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="main-form_item-bottom">
                                                <div class="main-form_item">
                                                    <label for="decription">Descripción</label>
                                                    <textarea placeholder="Estado de salud, lugar del encuentro, algo que creas destacable..."></textarea>
                                                </div>
                                                <div class="main-form_item">
                                                    <label for="animal photo">Foto del animal</label>
                                                    <input type="file">
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    // main.classList.remove();
    main.innerHTML= HTMLcontent;
}