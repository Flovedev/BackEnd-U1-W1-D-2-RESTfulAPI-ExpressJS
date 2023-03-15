import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogsSchema = new Schema(
  {
    category: { type: String, requiered: true },
    title: { type: String, requiered: true },
    cover: { type: String, requiered: true },
    readTime: {
      value: { type: Number, requiered: true },
      unit: { type: String, requiered: true },
    },
    author: {
      name: { type: String, requiered: true },
      avatar: { type: String, requiered: true },
    },
    content: { type: String, requiered: true },
    comments: [
      {
        comment: { type: String, requierd: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("Blog", blogsSchema);
