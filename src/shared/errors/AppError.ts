import StatusCode from '@shared/util/StatusCode';

class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = StatusCode.BAD_REQUEST) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
