import Joi from "joi";
import {
  issueToken,
  attemptLogin,
  issueNewToken,
  checkSignedIn,
} from "../../functions/Auth";
import mongoose from "mongoose";
import { User } from "../../models";
import { UserInputError } from "apollo-server-express";
import { registerValidate, loginValidate } from "../validators";

export default {
  Query: {
    profile: async (root, args, { req }, info) => {
      const authUser = await checkSignedIn(req);
      return authUser;
    },

    users: async (root, args, { req }, info) => {
      // TODO: pagination
      const authUser = await checkSignedIn(req);
      return await User.find();
    },

    user: async (root, { id }, { req }, info) => {
      const authUser = await checkSignedIn(req);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`);
      }
      return await User.findById(id);
    },

    login: async (root, args, { req }, info) => {
      await Joi.validate(args, loginValidate, { abortEarly: false });
      const user = await attemptLogin(args);
      let tokens = await issueToken(user);
      return { user, ...tokens };
    },

    refreshTokens: async (root, args, { req }, info) =>
      await issueNewToken(req),
  },

  Mutation: {
    register: async (root, args, { req }, info) => {
      await Joi.validate(args, registerValidate, { abortEarly: false });
      const user = await User.create(args);
      let tokens = await issueToken(user);
      return { user, ...tokens };
    },
  },
};
