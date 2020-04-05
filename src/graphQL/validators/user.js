import Joi from "joi";

const name = Joi.string().max(255).required().label("Name");
const email = Joi.string().email().required().label("Email");
const username = Joi.string().alphanum().min(8).max(20).label("Username");
const password = Joi.string()
  .min(8)
  .max(30)
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
  .label("Password")
  .options({
    language: {
      string: {
        regex: {
          base:
            "Must have atleast one lowercase letter, one uppercase letter and one digit",
        },
      },
    },
  });

export const loginValidate = Joi.object().keys({
  username,
  password,
});

export const registerValidate = Joi.object().keys({
  email,
  name,
  username,
  password,
});
