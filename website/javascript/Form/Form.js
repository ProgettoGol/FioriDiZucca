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

    resetForm(...ids) {
        // In assenza di parametri, resetta tutti i campi del form
        // Altrimenti, resetta solo i campi il cui id è stato passato come parametro
        let resetAll = (ids.length === 0);
        Reflect.ownKeys(this).forEach(key => {
            let inputElement = this[key].inputElement;
            if(inputElement instanceof HTMLElement) {
                if(ids.includes(this[key]) || resetAll) {
                    inputElement.value = "";
                }
            }
        })
    }

    onFormSubmit() {

    }

    init() {
        this.resetForm()
    }
}