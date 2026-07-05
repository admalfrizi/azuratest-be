import CaseError from "./CaseError";

class ValidationError extends CaseError {
    constructor(message = "Invalid input", details?: string[]) {
        super(message, 400, details);
    }
}

export default ValidationError;