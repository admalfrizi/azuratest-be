import CaseError from "./CaseError";

export class NotFoundError extends CaseError {
    constructor(message = "Resource not found") {
        super("NOT_FOUND", message, 404);
    }
}