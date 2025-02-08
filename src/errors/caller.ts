export class CallerDataFilterationError extends Error {
    constructor(error: any, message: string) {
        super(message);
        this.name = "CallerDataFilterationError";
    }
}
