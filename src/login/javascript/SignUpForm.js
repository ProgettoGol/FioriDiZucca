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

        let self = this;

        function code201Callback(httpResponse) {
            self.code201Handler(httpResponse)
        }

        function code400Callback(httpResponse) {
            self.code400Handler(httpResponse)
        }

        function code403Callback(httpResponse) {
            self.code403Handler(httpResponse)
        }

        function code409Callback(httpResponse) {
            self.code409Handler(httpResponse)
        }

        let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
        successfulResponses[1] = code201Callback;
        clientErrorResponses[0] = code400Callback;
        clientErrorResponses[3] = code403Callback;
        clientErrorResponses[9] = code409Callback;
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