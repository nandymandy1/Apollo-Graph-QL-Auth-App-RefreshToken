import Joi from "joi";
// import mongoose from "mongoose";
import { checkSignedIn } from "../../functions/Auth";
import { Post } from "../../models";
import { postValidate } from "../validators";
// import { UserInputError } from "apollo-server-express";

export default {
  Query: {
    posts: async () => {
      try {
        const post = await Post.find().populate({
          path: "author",
          select: "name username email",
        });
        return post;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    myPosts: (root, args, { req }, info) => {},

    postById: async (root, args, { req }, info) => {
      try {
        const post = await Post.findById(args.id);
        if (!post) {
          throw new Error(`Post Not found with the id ${id}`);
        }
        return post;
      } catch (err) {
        console.log("POST_NOT_FOUND_ERROR", err.message);
        throw new Error(err.message);
      }
    },
  },

  Mutation: {
    addPost: async (root, args, { req }, info) => {
      try {
        let { id } = await checkSignedIn(req);
        await Joi.validate(args.newPost, postValidate, { abortEarly: false });

        if (!id) {
          throw new Error("Unathenticated");
        }

        let { newPost } = args;
        let post = await Post.create({ ...newPost, author: id });
        return {
          post,
          message: "Post created successfully",
        };
      } catch (err) {
        console.log("ADD_POST_ERROR", err.message);
        throw new Error(err.message);
      }
    },

    editPost: async (root, args, { req }, info) => {
      try {
        let { id, updatedPost } = args;
        await Joi.validate(updatedPost, postValidate, { abortEarly: false });

        // Check if the user is authenticated or not
        let authUser = await checkSignedIn(req);
        if (!authUser) {
          throw new Error("Unathenticated");
        }

        // Now Check id that post belongs to the user
        const isAuth = await Post.postUserAccess(id, authUser);
        if (!isAuth) {
          throw new Error("This is not your post.");
        }

        let post = await Post.findByIdAndUpdate(id, updatedPost, {
          new: true,
        });

        if (!post) {
          throw new Error(`Post Not found with the id ${id}`);
        }

        post = post.populate("author").execPopulate();

        return {
          post,
          message: "Post Updated Successfully.",
        };
      } catch (err) {
        console.log("EDIT_POST_ERROR", err.message);
        throw new Error(err.message);
      }
    },

    deletePost: async (root, args, { req }, info) => {
      try {
        let { id } = args;

        // Check if the user is authenticated or not
        let authUser = await checkSignedIn(req);

        if (!authUser) {
          throw new Error("Unathenticated");
        }

        // Now Check id that post belongs to the user
        const isAuth = await Post.postUserAccess(id, authUser);

        if (!isAuth) {
          throw new Error("This is not your post.");
        }

        let post = await Post.findByIdAndDelete(id);

        if (!post) {
          throw new Error(`Post Not found with the id ${id}`);
        }

        post = post.populate("author").execPopulate();

        return {
          post,
          message: "Post Deleted Successfully.",
        };
      } catch (err) {
        console.log("DELETE_POST_ERROR", err.message);
        throw new Error(err.message);
      }
    },
  },
};
