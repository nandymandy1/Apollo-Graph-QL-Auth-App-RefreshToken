import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.statics.postUserAccess = async function (id, user) {
  let post = await this.findById(id);
  return post.author.toString() === user.id.toString();
};

const Post = model("posts", PostSchema);
export default Post;
