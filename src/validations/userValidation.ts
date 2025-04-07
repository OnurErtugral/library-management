import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot be longer than 100 characters",
    "any.required": "Name is required",
  }),
});
