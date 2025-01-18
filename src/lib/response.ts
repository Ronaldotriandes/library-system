import { Response } from 'express';

interface ResponseMetadata {
  [key: string]: any;
}

export const SuccessOK = (res: Response, data: any, message?: string) => {
  res.status(200).json({
    status: true,
    message,
    data,
  });
};

export const SuccessOKMeta = (
  res: Response,
  data: any,
  message: string = 'Success',
  meta: ResponseMetadata = {}
) => {
  res.status(200).json({
    message,
    status: true,
    data,
    meta,
  });
};

export const SuccessCreated = (res: Response, data: any, message: string = 'Success Created') => {
  res.status(201).json({
    status: true,
    message,
    data,
  });
};

export const ErrorNotFound = (res: Response, message: string = 'Not found!') => {
  res.status(404).json({
    status: false,
    message,
  });
};

export const ErrorBadRequest = (
  res: Response,
  errors: any[] = [],
  message: string = 'Bad Request!'
) => {
  res.status(400).json({
    status: false,
    message,
    errors,
  });
};
