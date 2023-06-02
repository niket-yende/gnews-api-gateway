class HttpError extends Error {
  status: number;
  body: {
    message: string;
    code?: number;
    data?: Record<string, any>
  };
  constructor(status: number, body: {message: string, code?: number, data?: Record<string, any>}) {
    super(body.message);
    this.status = status;
    this.body = body;
  }
}

export default HttpError;
