import Joi from "joi";

export const boulderSchema = Joi.object({
  name: Joi.string().min(3).required(),
  grade: Joi.string().required(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  description: Joi.string().allow(""),
  imagesUrl: Joi.string().uri().optional(),
});
