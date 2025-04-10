var httpRequest = new HttpRequest();
// var form = new Form();
var sessionHandler = new SessionHandler();
var logInForm = new LogInForm();
var signUpForm = new SignUpForm();

window.onload = function() {
    // form.init()
    sessionHandler.retrieveSession()
    sessionHandler.destroySession()
}