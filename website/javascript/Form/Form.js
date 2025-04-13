class Form {
    showCustomValidity(input, message) {
        input.inputElement.setCustomValidity(message)
        input.inputElement.reportValidity()
    }

    showMessage(message, success, milliseconds, divId) {
        // Prende come argomento:
        // il messaggio da mostrare,
        // un booleano (true colora il testo di verde, false di rosso)
        // il numero di millisecondi per cui mostrare il messaggio
        // l'id del contenitore del messaggio (che deve a sua volta contenere un tag <p>)

        let resultDiv = document.getElementById(`${divId}`);
        let resultMessage = document.querySelector(`#${divId} p`)

        resultMessage.textContent = message;
        if(success) resultMessage.classList.add("text-success")
        else resultMessage.classList.add("text-danger")

        resultDiv.classList.remove("d-none")
        resultDiv.classList.add("d-flex")

        return new Promise( (resolve) => {
            setTimeout(function() {
                resultDiv.classList.remove("d-flex")
                resultDiv.classList.add("d-none")
                if(success) resultMessage.classList.remove("text-success")
                else resultMessage.classList.remove("text-danger")
                resolve()
            }, milliseconds)
        })
    }

    resetForm(...inputs) {
        // In assenza di parametri, resetta tutti i campi del form
        // Altrimenti, resetta solo i campi il cui id è stato passato come parametro

        let resetAll = (inputs.length === 0);
        Reflect.ownKeys(this).forEach(key => {
            if(this[key] instanceof Input) {
                let inputElement = this[key].inputElement;
                if(inputElement instanceof HTMLElement) {
                    if(inputs.includes(this[key]) || resetAll) {
                        inputElement.value = "";
                    }
                }
            }
        })
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico,
        // si cerca di accedere a risorse del database vietate
        
        console.error(httpResponse.code, httpResponse.message)
    }

    onFormSubmit(order, ...messages) {
        // Verifica la validità di ogni oggetto Input attributo del Form
        // Ritorna false se un input non è valido
        // Il numero di messaggi defisce il numero di attributi dei quali viene verificata la validità (-> required)
        // order è un array di indici che  permette di mostrare i messaggi di validazione nell'ordine preferito (rispetto all'ordine di definizione)
        // I messaggi vanno passati nell'ordine prescelto

        let keys = Reflect.ownKeys(this);
        let inputs = [];
        let skipCounter = 0;
        for(let index = 0; index < (messages.length + skipCounter); index++) {
            const key = keys[index]
            if(this[key] instanceof Input) {
                if(order.length === 0) {
                    inputs.push(this[key])
                } else {
                    inputs[order[index - skipCounter]] = this[key]
                }
            } else {
                skipCounter++;
            }
        }

        for(let index = 0; index < messages.length; index++) {
            const input = inputs[index]
            if(input.isInputNotValid()) {
                this.showCustomValidity(input, messages[index])
                return false;
            }
        }

        return true;
    }

    init() {
        this.resetForm()
    }
}