class TimeInput extends Input {
    constructor(inputElement) {
        super(inputElement)
    }

    enableTimes(reservations) {
        // Abilita tutte le options tranne quelle per cui è già stata effettuata una prenotazione
        let times = document.querySelectorAll(`#${this.inputElement.id} option`);

        let reservationKeys = Object.keys(reservations);
        let reservationValues = [];
        reservationKeys.forEach(reservationKey => {
            reservationValues.push(reservations[reservationKey])
        })

        for(const time of times) {
            if(!reservationValues.includes(time.value)) {
                time.disabled = false;
            }
        }
    }

    disableTimes() {
        // Disabilita tutte le options
        let times = document.querySelectorAll(`#${this.inputElement.id} option`);
        for(const time of times) {
            time.disabled = true;
        }
    }
}