var httpRequest = new HttpRequest();
var sessionHandler = new SessionHandler();

document.addEventListener("DOMContentLoaded", event => { 
    sessionHandler.retrieveSession()
    let loginDiv = document.getElementById("login_div");
    let linkLoginDiv = document.getElementById("link_login_div");
    if(!sessionHandler.isSessionActive) {
        linkLoginDiv.innerHTML = `
            <p class="list-group-item text-xs" onclick="window.location = '/src/login/html/login.html'">Area personale</p>
        `        

        if(!(window.location.pathname === '/src/login/html/login.html' || window.location.pathname === '/src/areapersonale/html/areapersonale.html')) {
            loginDiv.innerHTML = `
                <button type="button" class="object-xs background-yellow rounded-responsive-3 border-responsive-2 d-flex justify-content-center align-items-center" onclick="location = '/src/login/html/login.html'">
                    <p class="list-group-item roboto-condensed-regular text-s text-dark">LOGIN</p>
                </button>
            `
        }
    } else {
        linkLoginDiv.innerHTML = `
        <p class="list-group-item text-xs" onclick="window.location = '/src/areapersonale/html/areapersonale.html'">Area personale</p>
        `
        loginDiv.innerHTML = `
            <button type="button" class="object-xs background-yellow rounded-responsive-3 border-responsive-2 d-flex justify-content-center align-items-center" onclick="sessionHandler.destroySession()">
                <p class="list-group-item roboto-condensed-regular text-s text-dark">LOGOUT</p>
            </button>
        `
    }
})