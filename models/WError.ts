export class WError extends Error {
  constructor(message: string) {
    super(message);
  }

  static from(err: Error): WError {
    return new WError(err.message);
  }
}
