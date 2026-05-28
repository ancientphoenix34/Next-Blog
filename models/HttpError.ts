export class HttpError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message); // passes message to the built-in Error class
    this.code = code;
    this.name = "HttpError";
  }
}