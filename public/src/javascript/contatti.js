var httpRequest = new HttpRequest();

class Prenotazione {
    constructor(orario, nome, cognome, email, message) {
        this.orario = orario;
        this.nome = nome + " " + cognome;
        this.email = email;
        this.message = message;
    }
}

// IMPLEMENT: Creare un date picker customizzato.
// In questo modo, alla creazione del date picker, si possono disable le date non valide.
class DatePicker {
    constructor() {
        this.dateInput = document.getElementById("date");
    }

    init() {
        let todayString = new Date().toISOString().split('T')[0];
        this.dateInput.setAttribute('min', todayString);
        this.hideForm()
    }

    #isDateNotValid(date) {
        // DEBUG: se si inserisce la data scrivendola, per certe date non aspetta che si finisca di inserirla prima di dare l'errore.
        // Si può risolvere, perché l'errore standard di data non disponibile (attributo min) funziona bene.
        // Esempio: 05/16/2025
        // DEBUG: Se una data è selezionata, si clicca la freccia per cambiare mese e lo stesso giorno il mese successivo è domenica, anche se non si seleziona quel giorno, appare il messaggio di errore
        let dayOfTheWeek = new Date(date).getUTCDay()
        return (dayOfTheWeek === 0)
    }

    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    #resetForm() {
        let resultDiv = document.getElementById("result");
        let times = document.querySelectorAll("option");

        resultDiv.style.display = "none";
        for(const time of times) {
            if(time.disabled) time.disabled = false;
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

    hideForm() {
        let formDivs = document.getElementsByClassName("form-div-js");
        for(const inputDiv of formDivs) {
            // if(inputDiv.style.display === "flex") {
                inputDiv.style.display = "none";
            // }
        }
    }

    disableTimes(reservations) {
        for(const reservation of reservations) {
            let time = document.querySelector('option[value="' + reservation + '"]');
            time.disabled = true;
        }
    }

    Code200Handler(httpResponse) {
        let reservations = JSON.parse(httpResponse.body);
        this.disableTimes(reservations)
        this.showForm()
    }

    Code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.showCustomValidity(dateInput, 'Impossibile prenotare per la data selezionata')
        this.dateInput.value = "";
    }

    Code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    onDateSelection() {
        this.#resetForm()
        let date = this.dateInput.value;

        // IMPLEMENT: Questa verifica si farà alla creazione del custom date picker (disabilitando le date non valide)
        if(this.#isDateNotValid(date)) {
            this.showCustomValidity(dateInput, 'Impossibile prenotare per la data selezionata')
            this.dateInput.value = "";
            return;
        }

        let httpResponse = httpRequest.databaseRequest("GET", "prenotazioni", date);
        httpRequest.handleResponse(httpResponse, this.Code200Handler.bind(this), null, this.Code400Handler.bind(this), this.Code403Handler.bind(this))
    }
}

class Form {
    constructor() {
        this.dateInput = document.getElementById("date");
        this.timeInput = document.getElementById("time");
        this.nameInput = document.getElementById("name");
        this.lastNameInput = document.getElementById("last_name");
        this.emailInput = document.getElementById("email");
        this.messageInput = document.getElementById("message");
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

var datePicker = new DatePicker();
var formHandler = new Form();

// DEBUG: Non vengono più nascosti o mostrati gli elementi HTML. Perché?

window.onload = function() {
    datePicker.init()
}