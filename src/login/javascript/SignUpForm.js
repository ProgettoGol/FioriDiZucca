class SignUpForm extends CredentialsForm {
    show() {
        let modal = new bootstrap.Modal(document.getElementById("sign_up_modal"))
        modal.show()
    }

    code400Handler(httpResponse) {
        this.resetForm()
        this.showMessage("Errore durante la registrazione. Riprovare", false, 3000, "result_sign_up")
    }

    code409Handler(httpResponse) {
        this.resetForm(this.usernameInput)
        this.showMessage("Username già in uso. Riprovare", false, 3000, "result_sign_up")
    }

    onFormSubmit() {
        let httpResponse = super.onFormSubmit([], 'Nome non valido', 'Cognome non valido', 'Username non valido', 'Password non valida')
        if(!(httpResponse instanceof HttpResponse) && !httpResponse) return;

        let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
        successfulResponses[1] = super.code201Handler.bind(this);
        clientErrorResponses[0] = this.code400Handler.bind(this);
        clientErrorResponses[3] = super.code403Handler.bind(this);
        clientErrorResponses[9] = this.code409Handler.bind(this);
        httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)
    }

    init() {
        this.type = "signup";

        this.nameInput = new Input(document.getElementById("sign_up_name"));
        this.lastNameInput = new Input(document.getElementById("sign_up_last_name"));
        this.usernameInput = new Input(document.getElementById("sign_up_username"));
        this.passwordInput = new Input(document.getElementById("sign_up_password"));

        super.init()
    }
}