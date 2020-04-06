import { Schema, model } from "mongoose";

const FileSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("files", FileSchema);
