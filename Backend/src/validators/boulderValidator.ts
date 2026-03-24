import Joi from "joi";

export const boulderSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  grade: Joi.string().required(),
  description: Joi.string().max(500).allow("", null),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  imagesUrl: Joi.string().allow("", null).optional(),
  topoData: Joi.object().optional().unknown(true),
}).unknown(true);
