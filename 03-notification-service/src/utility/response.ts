import { Request, Response } from 'express';
import { RESPONSE } from './responseCode';

type ResponseData = {
  message?: string;
  doNotIgnore?: boolean;
  [key: string]: any;
};

export function sendSuccessResponse(_: Request, res: Response, data: ResponseData = {}, httpCode: number = 200, message?: string): void {
  // Add the provided message directly to the response data
  if (!data.message && message) {
    data.message = message;
  } else if (data && message) {
    data.message = message;
  }

  // Prepare response structure
  const responseData: Record<string, any> = {
    data,
    statusCode: httpCode,
    message: data.message || 'Success'
  };

  // Include `doNotIgnore` if present in `data`
  if (data.doNotIgnore) {
    responseData.doNotIgnore = data.doNotIgnore;
  }

  // Headers placeholder, if needed
  const headers: Record<string, string> = {};

  // Send response
  res.status(httpCode).set(headers).send(responseData);
}

export function sendFailResponse(
  _: Request,
  res: Response,
  httpCode = RESPONSE.BAD_REQUEST,
  message: string,
  data?: Record<string, any>
) {
  if (!data && message) {
    data = {
      statusCode: httpCode,
      message: message
    };
  } else if (data && message) {
    data.message = message;
  }
  if (data) {
    data.data = {};
  }
  res.status(httpCode).send(data);
}
