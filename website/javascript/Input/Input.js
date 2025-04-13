class Input {
    constructor(inputElement) {
        this.showCustomValidityCallback;
        this.inputElement = inputElement;
        this.changed = false;
    }

    isInputNotValid() {
        return this.inputElement.value.trim() === "";
    }

    onInput() {
        this.showCustomValidityCallback(this, "")
        this.changed = true;
    }
}