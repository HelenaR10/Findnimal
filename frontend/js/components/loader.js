function showLoader() {
    const spinner = `<div class="spinner">
                        <img src="assets/spinner.svg" alt="spinner">
                    </div>`;

    document.body.insertAdjacentHTML('afterBegin', spinner);
}

function removeLoader() {
    const spinner = document.querySelector('.spinner');
    spinner.remove();
}