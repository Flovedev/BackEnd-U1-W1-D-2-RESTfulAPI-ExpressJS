import Express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./model.js";

const blogsRouter = Express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
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
        createHttpError(404, `Blog with the id: ${req.params._id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body);
    const { _id } = await newBlog.save();

    res.status(201).send({ NewBlog: _id });
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
        createHttpError(404, `Blog with the id: ${req.params._id} not found.`)
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

export default blogsRouter;
