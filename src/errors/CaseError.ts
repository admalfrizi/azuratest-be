class CaseError extends Error {
    public readonly code: string;
    public readonly message: string;
    public readonly statusCode: number;

    constructor(code: string, message: string, statusCode: number) {
        super();
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default CaseError;