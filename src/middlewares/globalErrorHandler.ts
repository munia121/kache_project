import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import config from '../config';
import AppError from '../errors/AppError';

export interface IErrorMessage {
  path: string | number;
  message: string;
}

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IErrorMessage[] = [];

  // 1. Handle AppError (Custom operational errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }
  // 2. Handle Prisma Known Request Error (e.g. unique constraint, not found, etc.)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      const target = (err.meta?.target as string[]) || [];
      const fieldName = Array.isArray(target) ? target.join(', ') : 'field';
      message = `Duplicate key error: '${fieldName}' already exists`;
      errorMessages = Array.isArray(target)
        ? target.map((field) => ({
            path: field,
            message: `${field} must be unique`,
          }))
        : [
            {
              path: '',
              message: `${fieldName} already exists`,
            },
          ];
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = (err.meta?.cause as string) || 'Requested record not found';
      errorMessages = [
        {
          path: '',
          message,
        },
      ];
    } else if (err.code === 'P2003') {
      statusCode = 400;
      message = 'Foreign key constraint failed';
      errorMessages = [
        {
          path: (err.meta?.field_name as string) || '',
          message: 'Referenced record does not exist',
        },
      ];
    } else {
      statusCode = 400;
      message = err.message.replace(/\n/g, ' ');
      errorMessages = [
        {
          path: '',
          message: err.message,
        },
      ];
    }
  }
  // 3. Handle Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Database validation error occurred';
    errorMessages = [
      {
        path: '',
        message: err.message.replace(/\n/g, ' '),
      },
    ];
  }
  // 4. Handle JSON parse SyntaxError (e.g. malformed JSON in request body)
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
    errorMessages = [
      {
        path: 'body',
        message: 'Could not parse JSON payload in request body',
      },
    ];
  }
  // 5. Handle Zod validation errors (if Zod is added later)
  else if (err?.name === 'ZodError' && Array.isArray(err?.issues)) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = err.issues.map((issue: any) => ({
      path: issue?.path?.[issue.path.length - 1] || '',
      message: issue?.message || 'Invalid value',
    }));
  }
  // 6. Generic JavaScript Error
  else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env === 'development' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
