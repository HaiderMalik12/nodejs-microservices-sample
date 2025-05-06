import { Request, Response } from 'express';

export function notFoundError(_: Request, res: Response) {
  const err = 'Oops! Page Not Found';
  res.status(404).send({ status: 404, message: err });
}
