import Joi from "joi";

export const historySchema = Joi.object({
  boulder: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid boulder ID" }),
  ascentType: Joi.string()
    .valid("onsight", "flash", "redpoint")
    .required(),
  attempts: Joi.number().integer().min(1).optional(),
  comment: Joi.string().max(500).allow("", null).optional(),
});
