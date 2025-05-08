import { Request, Response } from 'express';

export default function globalErrorHandler(err: Error, _: Request, __: Response) {
  console.error(err); // Log the error for debugging

  // let statusCode = 500; // Default status code for internal server error

  // if (err.name === 'ValidationError') {
  //   statusCode = 400; // Bad Request for validation errors
  // } else if (err.name === 'UnauthorizedError') {
  //   statusCode = 401; // Unauthorized
  // } else if (err.name === 'ForbiddenError') {
  //   statusCode = 403; // Forbidden
  // }

  // res.status(statusCode).json({
  //   message: err.message || 'Internal Server Error'
  //   // You can add more details here if needed, like stack trace (in development)
  // });
  throw err.message;
}
