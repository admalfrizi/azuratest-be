class CaseError extends Error {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(message: string, statusCode: number, details?: unknown) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export default CaseError;