import Joi from "joi";

const body = Joi.string().max(600).required().label("Body");
const title = Joi.string().max(120).required().label("Title");

export const postValidate = Joi.object().keys({
  body,
  title,
});
