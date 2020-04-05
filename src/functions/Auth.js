import jwt from "jsonwebtoken";
import { User } from "../models";
import { APP_SECRET } from "../config";
import { AuthenticationError } from "apollo-server-express";

export const checkSignedIn = async (req, requireAuth = true) => {
  const header = req.headers.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, APP_SECRET);
    let user = await User.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError("Invalid user credentials.");
    }
    return user;
  }
  if (requireAuth) {
    throw new AuthenticationError("You must be logged in.");
  }
  return null;
};

export const issueNewToken = async (req) => {
  try {
    const token = req.headers.refreshtoken;
    if (token) {
      const decoded = jwt.verify(token, APP_SECRET);
      let user = await User.findById(decoded.id);
      if (!user) {
        throw new AuthenticationError("No user found.");
      }
      let tokens = await issueToken(user);
      return { ...tokens, user };
    }
  } catch (err) {
    throw new AuthenticationError("Invalid Refresh Token.");
  }
};

export const attemptLogin = async ({ username, password }) => {
  const messsage = "Incorrect username or password. Please try again.";
  const user = await User.findOne({ username });
  if (!user) {
    throw new AuthenticationError(messsage);
  }
  if (!(await user.isMatch(password, user.password))) {
    throw new AuthenticationError(messsage);
  }
  return user;
};

export const issueToken = async (user) => {
  let token = "Bearer " + (await createToken(user));
  let refreshToken = await createToken(user, "7d");
  return { token, refreshToken };
};

const createToken = async ({ id, username, name, email }, expiresIn = 200) =>
  await jwt.sign({ id, username, name, email }, APP_SECRET, { expiresIn });
