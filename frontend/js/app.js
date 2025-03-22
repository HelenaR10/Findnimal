document.addEventListener('DOMContentLoaded', () => {
    renderMain();
    renderHome();
});

function renderMain() {
    const HTMLcontent = `${renderHeader()}
                        <main></main>
                        ${renderFooter()}`;

    document.body.innerHTML = HTMLcontent;
}