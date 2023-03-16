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
    author: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, requiered: true },
    comments: [
      {
        comment: { type: String, requierd: true },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "Likes" }],
  },
  { timestamps: true }
);

export default model("Blog", blogsSchema);
