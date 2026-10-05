import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: `Route ${req.method} ${req.originalUrl} does not exist on this server`,
      },
    ],
  });
};

export default notFound;
