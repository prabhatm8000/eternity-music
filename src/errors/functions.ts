export class CallerDataFilterationError extends Error {
    constructor(error: any, message: string) {
        super(`${message}\n${error}`);
        this.name = "CallerDataFilterationError";
    }
}
