
import { ValidationError, ConflictError, NotFoundError, ForbiddenError ,InternalServerError } from "./customErrors.js";

export const routeErrorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError || 
      err instanceof ConflictError || 
      err instanceof NotFoundError ||
      err instanceof ForbiddenError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message
      }
    });
  }

  if (err instanceof InternalServerError) {
    return res.status(500).json({
      error: {
        message: 'Internal Server Error'
      }
    });
  }

  res.status(500).json({
    error: {
      message: 'Something went wrong'
    }
  });

};

