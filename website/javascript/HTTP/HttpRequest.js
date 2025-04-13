class HttpRequest {
    constructor() {
        this.server = new SimulatedServer();
    }

    databaseRequest(type, item, key, body) {
        try {
            return this.server.handleDatabaseRequest(type, item, key, body)
        } catch(response) {
            return response;
        }
    }

    handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses) {
        // Informational responses (100 - 103)
        // Successful responses (200 - 226)
        // Redirection messages (300 - 308)
        // Client error responses (400 - 451)
        // Server error responses (500 - 511)

        let responseBlock;
        switch(Number(String(httpResponse.code)[0])) {
            case 1: {
                responseBlock = informationalResponses;
                break;
            }
            case 2: {
                responseBlock = successfulResponses;
                break;
            }
            case 3: {
                responseBlock = redirectionMessages;
                break;
            }
            case 4: {
                responseBlock = clientErrorResponses;
                break;
            }
            case 5: {
                responseBlock = serverErrorResponses;
                break;
            }
            default: {
                console.error("Unknown Error", httpResponse)
                break;
            }
        }

        let responsePosition = Number(String(httpResponse.code)[2]);

        responseBlock[responsePosition](httpResponse)        
    }
}