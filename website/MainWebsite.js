var httpRequest = new HttpRequest();
var sessionHandler = new SessionHandler();

document.addEventListener("DOMContentLoaded", event => { 
    sessionHandler.retrieveSession()
    let buttonDiv = document.getElementById("login_div");
    if(!sessionHandler.isSessionActive) {
        if(!(window.location.pathname === '/src/login/html/login.html' || window.location.pathname === '/src/areapersonale/html/areapersonale.html')) {
            buttonDiv.innerHTML = `
                <button type="button" class="object-xs background-yellow rounded-responsive-3 border-responsive-2 d-flex justify-content-center align-items-center" onclick="location = '/src/login/html/login.html'">
                    <p class="list-group-item roboto-condensed-regular text-s text-dark">LOGIN</p>
                </button>
            `
        }
    } else {
        buttonDiv.innerHTML = `
            <button type="button" class="object-xs background-yellow rounded-responsive-3 border-responsive-2 d-flex justify-content-center align-items-center" onclick="sessionHandler.destroySession()">
                <p class="list-group-item roboto-condensed-regular text-s text-dark">LOGOUT</p>
            </button>
        `
    }
})