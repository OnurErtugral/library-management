import Joi from "joi";

export const createBookSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(200).messages({
    "string.empty": "Name is required",
    "string.min": "Name must not be empty",
    "string.max": "Name cannot be longer than 200 characters",
    "any.required": "Name is required",
  }),
});
