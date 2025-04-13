class CredentialsForm extends Form {
    code201Handler(httpResponse) {
        let tokenJSON = JSON.parse(httpResponse.body)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/areapersonale/html/areapersonale.html")
    }

    onFormSubmit(order, ...messages) {
        let isValid = super.onFormSubmit(order, ...messages)
        if(!isValid) return;

        let name, lastName;
        try {
            name = this.nameInput.inputElement.value;
            lastName = this.lastNameInput.inputElement.value;
        } catch(error) {
            name = "";
            lastName = "";
        }
         

        let credentials = new Credentials(name, lastName, this.passwordInput.inputElement.value, this.type)

        let httpResponse = httpRequest.databaseRequest("POST", "credenziali", this.usernameInput.inputElement.value, JSON.stringify(credentials))

        return httpResponse;
    }

    init() {
        let self = this;

        function showCustomValidityCallback(input, message) {
            self.showCustomValidity(input, message)
        }

        super.init()

        Reflect.ownKeys(this).forEach(key => {
            if(this[key] instanceof Input) {
                this[key].showCustomValidityCallback = showCustomValidityCallback;
            }
        })
    }
}