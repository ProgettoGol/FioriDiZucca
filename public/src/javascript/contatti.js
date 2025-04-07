var todayString = new Date().toISOString().split('T')[0];

// Create dynamically?
var dateInput = document.getElementById("date");
dateInput.setAttribute('min', todayString);

var timeInput = document.getElementById("time");
var nameInput = document.getElementById("name");
var lastNameInput = document.getElementById("last_name");
var emailInput = document.getElementById("email");
var messageInput = document.getElementById("message");

var formDivs = document.getElementsByClassName("form-div-js");
for(const input of formDivs) {
    input.style.display = "none";
}

var result = document.getElementById("result");
result.style.display = "none";

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
            if(inputDiv.style.display === "none") {
                inputDiv.style.display = "flex";
            }
        }
    }

    hideForm() {
        let formDivs = document.getElementsByClassName("form-div-js");
        for(const inputDiv of formDivs) {
            if(inputDiv.style.display === "flex") {
                inputDiv.style.display = "none";
            }
        }
    }

    disableTimes(reservations) {
        for(const reservation of reservations) {
            let time = document.querySelector('option[value="' + reservation + '"]');
            time.disabled = true;
        }
    }

    Code200Handler() {
        let reservations = JSON.parse(httpResponse.body);
        this.disableTimes(reservations)

        // DEBUG: ripete l'operazione inutilmente: quando sono già flex, il codice non deve essere eseguito
        this.showForm()
    }

    Code400Handler() {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.showCustomValidity(dateInput, 'Impossibile prenotare per la data selezionata')
        this.dateInput.value = "";
    }

    Code403Handler() {
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
        } else {
            let httpResponse = httpRequest.databaseRequest("GET", "prenotazioni", date);
            httpRequest.handleResponse(httpResponse, this.Code200Handler, this.Code400Handler, this.Code403Handler)
        }
    }
}

class Form {
    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    onFormSubmit(date) {
        let dateInput = document.getElementById("date");
        let timeInput = document.getElementById("time");
        let nameInput = document.getElementById("name");
        let lastNameInput = document.getElementById("last_name");
        let emailInput = document.getElementById("email");
        let messageInput = document.getElementById("message");

        if(dateInput.value === "") {
            this.showCustomValidity(dateInput, 'Selezionare una data')
            return;
        }

        if(timeInput.value === "") {
            this.showCustomValidity(timeInput, 'Selezionare un orario')
            return;
        }

        if(nameInput.value === "") {
            this.showCustomValidity(nameInput, 'Inserire un nome')
            return;
        }

        if(lastNameInput.value === "") {
            this.showCustomValidity(lastNameInput, 'Inserire un cognome')
            return;
        }

        if(emailInput.value === "") {
            this.showCustomValidity(emailInput, "Inserire un'email")
            return;
        }

        let date = dateInput.value;

        let prenotazione = new Prenotazione(timeInput.value, nameInput.value, lastNameInput.value, emailInput.value, messageInput.value)
        prenotazione = JSON.stringify(prenotazione)

        let httpResponse = httpRequest.databaseRequest("PUT", "prenotazioni", date, prenotazione);
        switch(httpResponse.code) {
            case 201: {
                dateInput.value = "";
                timeInput.value = "";
                nameInput.value = "";
                lastNameInput.value = "";
                emailInput.value = "";
                messageInput.value = "";

                // Non strettamente necessario, ma sempre meglio resettare tutti gli input
                let times = document.querySelectorAll("option");
                for(const time of times) {
                    if(time.disabled) time.disabled = false;
                }

                for(const input of formDivs) {
                    input.style.display = "none";
                }

                let resultMessage = document.querySelector("#result p")
                resultMessage.textContent = "Prenotazione effettuata con successo";

                if(resultMessage.classList.contains("text-danger")) {
                    resultMessage.classList.remove("text-danger")
                }
                if(!resultMessage.classList.contains("text-success")) {
                    resultMessage.classList.add("text-success")
                }

                result.style.display = "flex";
                setTimeout(function() {result.style.display = "none"}, 3000)

                break;
            }
            case 400: {
                // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
                // Il server effettua di nuovo la validazione dell'input e ritorna un errore
                dateInput.value = "";
                timeInput.value = "";
                nameInput.value = "";
                lastNameInput.value = "";
                emailInput.value = "";
                messageInput.value = "";

                // Non strettamente necessario, ma sempre meglio resettare tutti gli input
                let times = document.querySelectorAll("option");
                for(const time of times) {
                    if(time.disabled) time.disabled = false;
                }

                for(const input of formDivs) {
                    input.style.display = "none";
                }

                let resultMessage = document.querySelector("#result p")

                if(resultMessage.classList.contains("text-success")) {
                    resultMessage.classList.remove("text-success")
                }
                if(!resultMessage.classList.contains("text-danger")) {
                    resultMessage.classList.add("text-danger")
                }

                resultMessage.textContent = "Errore durante la prenotazione. Riprovare";

                result.style.display = "flex";
                setTimeout(function() {result.style.display = "none"}, 3000)

                break;
            }
            case 403: {
                // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
                console.error(httpResponse.code, httpResponse.message)
                break;
            }
            default: {
                console.error("Unknown Error", httpResponse)
                break;
            }
        }
    }
}

var datePicker = new DatePicker();
var formHandler = new Form();