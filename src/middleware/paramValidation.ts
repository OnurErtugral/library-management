import { Request, Response, NextFunction } from "express";

export const validateId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        error: "Validation Error",
        message: `${paramName} parameter is required`,
      });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: `${paramName} must be a positive integer`,
      });
    }

    next();
  };
};
