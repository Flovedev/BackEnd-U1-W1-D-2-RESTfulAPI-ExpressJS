import Express from "express";
import q2m from "query-to-mongo";
import createHttpError from "http-errors";
import BlogsModel from "./model.js";
import AuthorsModel from "../authors/model.js";
import { basicAuth } from "../../lib/auth/basic.js";
import { adminOnly } from "../../lib/auth/admin.js";

const blogsRouter = Express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const blogs = await BlogsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({ path: "author", select: "name surname" });
    const total = await BlogsModel.countDocuments(mongoQuery.criteria);

    res.send({
      links: mongoQuery.links(process.env.MONGO_QUERY, total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      blogs,
    });
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const checkAuthor = await AuthorsModel.findById(req.body.author);
    if (checkAuthor) {
      const newBlog = new BlogsModel(req.body);
      const { _id } = await newBlog.save();
      const allAuthors = await req.body.author.map((e) => {
        AuthorsModel.findByIdAndUpdate(
          e,
          { $push: { blogs: _id } },
          { new: true, runValidators: true }
        );
      });

      res.status(201).send({ NewBlog: _id });
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedBlog = await BlogsModel.findByIdAndDelete(req.params.id);

    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:blogId/like/:authorId", async (req, res, next) => {
  try {
    const blogToLike = await BlogsModel.findById(req.params.blogId);
    if (!blogToLike)
      return next(
        createHttpError(
          404,
          `Blog with the id: ${req.params.blogId} not found.`
        )
      );

    const authorAboutLike = await AuthorsModel.findById(req.params.authorId);
    if (!authorAboutLike)
      return next(
        createHttpError(
          404,
          `Author with the id: ${req.params.authorId} not found.`
        )
      );

    const isLikedYet = await BlogsModel.findOne({
      likes: req.params.authorId,
    });

    if (isLikedYet) {
      const letsDislike = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,
        { $pull: { likes: req.params.authorId } },
        { new: true, runValidators: true }
      );
      res.send(letsDislike);
    } else {
      const letsLike = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { likes: req.params.authorId } },
        { new: true, runValidators: true }
      );
      res.send(letsLike);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/me/stories", basicAuth, async (req, res, next) => {
  try {
    const allBlogs = await AuthorsModel.findById(req.author._id).populate({
      path: "blogs",
      select: "title cover readTime content",
    });

    res.send(allBlogs.blogs);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
