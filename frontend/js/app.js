document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});

function renderMain() {
    const isAuth = checkAuth();
    
    const HTMLcontent = `${renderHeader(isAuth)}
    <main></main>
    ${renderFooter()}`;
    
    document.body.innerHTML = HTMLcontent;
    renderHome();
}