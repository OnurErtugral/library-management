import Joi from "joi";

// Return book validation schema
export const returnBookSchema = Joi.object({
  score: Joi.number().integer().min(1).max(10).allow(null).messages({
    "number.base": "Score must be a number",
    "number.integer": "Score must be an integer",
    "number.min": "Score must be at least 1",
    "number.max": "Score cannot be more than 10",
  }),
});
