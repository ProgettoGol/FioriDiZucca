class HttpRequest {
    constructor() {
        this.xmlHttpRequest = new XMLHttpRequest();
        this.server = new SimulatedServer();
    }

    // REQUESTS
    getFromDatabase(item, key) {
        try {
            return this.server.handleDatabaseRequest(item, key)
        } catch(response) {
            return response;
        }
    }

    saveToDatabase() {

    }

    // RESPONSES

}