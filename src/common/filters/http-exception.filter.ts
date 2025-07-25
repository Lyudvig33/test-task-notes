import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

interface IHttpErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

function isHttpErrorResponse(obj: unknown): obj is IHttpErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    Array.isArray((obj as Record<string, unknown>).message)
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.message
      : 'Internal server error';

    const errorResponse: Record<string, unknown> = {
      result: 'error',
      message,
    };

    if (isHttpException && typeof exception.getResponse === 'function') {
      const exceptionResponse = exception.getResponse();

      if (isHttpErrorResponse(exceptionResponse)) {
        errorResponse.errors = exceptionResponse.message;
      }
    }

    response.status(status).json(errorResponse);
  }
}
