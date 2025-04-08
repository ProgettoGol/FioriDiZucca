class Form {
    constructor() {
        this.datePicker = new DatePicker();
        this.dateInput = this.datePicker.dateInput;
        this.timeInput = document.getElementById("time");
        this.nameInput = document.getElementById("name");
        this.lastNameInput = document.getElementById("last_name");
        this.emailInput = document.getElementById("email");
        this.messageInput = document.getElementById("message");
    }

    resetForm() {
        let resultDiv = document.getElementById("result");
        let times = document.querySelectorAll("option");

        resultDiv.style.display = "none";
        for(const time of times) {
            if(time.disabled) time.disabled = false;
        }
    }

    hideForm() {
        let formDivs = document.getElementsByClassName("form-div-js");
        for(const inputDiv of formDivs) {
            // DEBUG: at onload, inputDiv.style.display === "". Why?
            // if(inputDiv.style.display === "flex") {
                inputDiv.style.display = "none";
            // }
        }
    }

    showForm() {
        let formDivs = document.getElementsByClassName("form-div-js");
        for(const inputDiv of formDivs) {
            // if(inputDiv.style.display === "none") {
                inputDiv.style.display = "flex";
            // }
        }
    }

    disableTimes(reservations) {
        for(const reservation of reservations) {
            let time = document.querySelector('option[value="' + reservation + '"]');
            time.disabled = true;
        }
    }

    init() {
        this.resetForm()
        this.hideForm()
        this.datePicker.disableTimesCallback = this.disableTimes;
        this.resetFormCallback = this.resetForm;
        this.datePicker.showFormCallback = this.showForm;
        this.datePicker.init()
    }

    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    resetForm() {
        let times = document.querySelectorAll("option");
        let formDivs = document.getElementsByClassName("form-div-js");

        this.dateInput.value = "";
        this.timeInput.value = "";
        this.nameInput.value = "";
        this.lastNameInput.value = "";
        this.emailInput.value = "";
        this.messageInput.value = "";

        // Non strettamente necessario, ma sempre meglio resettare tutti gli input
        for(const time of times) {
            if(time.disabled) time.disabled = false;
        }

        for(const input of formDivs) {
            input.style.display = "none";
        }
    }

    showMessage(message, success) {
        let resultMessage = document.querySelector("#result p")
        resultMessage.textContent = message;

        if(success) resultMessage.classList.add("text-success")
        else resultMessage.classList.add("text-danger")

        result.classList.remove("d-none")
        result.classList.add("d-flex")

        setTimeout(function() {
            result.classList.remove("d-flex")
            result.classList.add("d-none")
            if(success) resultMessage.classList.remove("text-success")
            else resultMessage.classList.remove("text-danger")
        }, 3000)
    }

    Code201Handler(httpResponse) {
        this.resetForm()
        this.showMessage("Prenotazione effettuata con successo", true)
    }

    Code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.resetForm()
        this.showMessage("Errore durante la prenotazione. Riprovare", false)
    }

    Code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    onFormSubmit() {

        if(this.dateInput.value === "") {
            this.showCustomValidity(this.dateInput, 'Selezionare una data')
            return;
        }

        if(this.timeInput.value === "") {
            this.showCustomValidity(this.timeInput, 'Selezionare un orario')
            return;
        }

        if(this.nameInput.value === "") {
            this.showCustomValidity(this.nameInput, 'Inserire un nome')
            return;
        }

        if(this.lastNameInput.value === "") {
            this.showCustomValidity(this.lastNameInput, 'Inserire un cognome')
            return;
        }

        if(this.emailInput.value === "") {
            this.showCustomValidity(this.emailInput, "Inserire un'email")
            return;
        }

        let date = this.dateInput.value;

        let prenotazione = new Prenotazione(this.timeInput.value, this.nameInput.value, this.lastNameInput.value, this.emailInput.value, this.messageInput.value)
        prenotazione = JSON.stringify(prenotazione)

        let httpResponse = httpRequest.databaseRequest("PUT", "prenotazioni", date, prenotazione);
        httpRequest.handleResponse(httpResponse, null, this.Code201Handler.bind(this), this.Code400Handler.bind(this), this.Code403Handler.bind(this))
    }
}