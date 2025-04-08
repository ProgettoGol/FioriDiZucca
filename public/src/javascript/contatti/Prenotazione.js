class Prenotazione {
    constructor(orario, nome, cognome, email, message) {
        this.orario = orario;
        this.nome = nome + " " + cognome;
        this.email = email;
        this.message = message;
    }
}