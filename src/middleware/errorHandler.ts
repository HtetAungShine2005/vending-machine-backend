import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Use the error's message if available, otherwise use the error's string representation
  let status = typeof err.status === 'number' ? err.status : 500;
  let message = (typeof err.message === 'string' && err.message.trim() !== '')
    ? err.message
    : (typeof err === 'string' ? err : 'An unexpected error occurred.');

  // Optionally include error details for debugging (remove in production)
  const details = err.stack || err;

  res.status(status).json({
    error: true,
    message,
    status,
    details // Remove or comment out this line in production for security
  });
};

export default errorHandler; 
