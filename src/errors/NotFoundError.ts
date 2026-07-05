import CaseError from "./CaseError";

class NotFoundError extends CaseError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export default NotFoundError;