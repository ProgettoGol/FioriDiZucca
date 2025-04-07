class HttpRequest {
    constructor() {
        this.xmlHttpRequest = new XMLHttpRequest();
        this.server = new SimulatedServer();
    }

    databaseRequest(type, item, key, body) {
        try {
            return this.server.handleDatabaseRequest(type, item, key, body)
        } catch(response) {
            return response;
        }
    }
}