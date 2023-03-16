import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, requiered: true },
    surname: { type: String, requiered: true },
    email: { type: String, requiered: true },
    dateOfBirth: { type: Date, requiered: true },
    blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true }
);

authorsSchema.static("findAuthorsWithBlogs", async function (query) {
  const authors = await this.find(query.criteria, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({ path: "blogs", select: "title category" });
  const total = await this.countDocuments(query.criteria);

  return { authors, total };
});

export default model("Author", authorsSchema);
