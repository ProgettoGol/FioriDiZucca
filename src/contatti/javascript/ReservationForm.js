// DEBUG: validazione timeInput -> orari superiori agli orari di chiusura (compreso il sabato) non validi
// DEBUG: validazione timeInput -> orari non ogni 15 minuti non validi
// DEBUG: validazione dateInput -> non possono essere selezionate date non realmente esistenti (esempio: 29-02-2019)
// DEBUG: validazione input -> il campo non deve essere uno spazio vuoto

class ReservationForm {
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
        this.datePicker = new DatePicker();
        this.dateInput = this.datePicker.dateInput;
        this.timeInput = document.getElementById("time");
        this.nameInput = document.getElementById("name");
        this.lastNameInput = document.getElementById("last_name");
        this.emailInput = document.getElementById("email");
        this.messageInput = document.getElementById("message");

        let self = this;

        function resetFormCallback(flag) {
            self.resetForm(flag)
        }

        function disableTimesCallback(reservations) {
            self.disableTimes(reservations)
        }

        function showFormCallback() {
            self.showForm()
        }

        this.resetForm(true)
        this.hideForm()
        this.datePicker.disableTimesCallback = disableTimesCallback;
        this.datePicker.resetFormCallback = resetFormCallback;
        this.datePicker.showFormCallback = showFormCallback;
        this.datePicker.init()
    }

    resetForm(flag) {
        // DEBUG: don't use an external flag: find another way to distinguish cases
        if(flag) {
            let times = document.querySelectorAll("option");
            for(const time of times) {
                if(time.disabled) time.disabled = false;
            }
        } else {
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
    }

    showMessage(message, success) {
        let resultMessage = document.querySelector("#result p")
        let resultDiv = document.getElementById("result");

        resultMessage.textContent = message;
        if(success) resultMessage.classList.add("text-success")
        else resultMessage.classList.add("text-danger")

        resultDiv.classList.remove("d-none")
        resultDiv.classList.add("d-flex")

        setTimeout(function() {
            resultDiv.classList.remove("d-flex")
            resultDiv.classList.add("d-none")
            if(success) resultMessage.classList.remove("text-success")
            else resultMessage.classList.remove("text-danger")
        }, 3000)
    }

    code201Handler(httpResponse) {
        this.resetForm(false)
        this.showMessage("Prenotazione effettuata con successo", true)
    }

    code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.resetForm()
        this.showMessage("Errore durante la prenotazione. Riprovare", false)
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    onFormSubmit() {
        let date = this.dateInput.value;

        let prenotazione = new Prenotazione(this.timeInput.value, this.nameInput.value, this.lastNameInput.value, this.emailInput.value, this.messageInput.value)
        prenotazione = JSON.stringify(prenotazione)

        let httpResponse = httpRequest.databaseRequest("PUT", "prenotazioni", date, prenotazione);
        httpRequest.handleResponse(httpResponse, null, this.code201Handler.bind(this), this.code400Handler.bind(this), this.code403Handler.bind(this))
    }
}