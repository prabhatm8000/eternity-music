export class FetcherCallError extends Error {
  constructor(error: any, message: string) {
    super(`${message}\n${error}`);
    this.name = 'FetcherCallError';
  }
}

export class FetcherResponseError extends Error {
  constructor(error: any, message: string) {
    super(`${message}\n${error}`);
    this.name = 'FetcherResponseError';
  }
}