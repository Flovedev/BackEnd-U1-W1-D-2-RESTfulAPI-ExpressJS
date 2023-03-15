import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    comment: { type: String, requiered: true },
  },
  { timestamps: true }
);

export default model("Comment", commentsSchema);
