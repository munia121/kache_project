import { Response } from 'express';

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data?: T | null;
}

export const sendResponse = <T>(res: Response, responseData: IApiResponse<T>): void => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message ?? 'Success',
    meta: responseData.meta ?? undefined,
    data: responseData.data !== undefined ? responseData.data : null,
  });
};

export default sendResponse;
