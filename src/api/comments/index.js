import Express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import BlogsModel from "../blogs/model.js";
import CommentsModel from "./model.js";

const commentRouter = Express.Router();

commentRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const foundBlog = await CommentsModel.findById(req.params.id);
    if (foundBlog) {
      res.send(foundBlog.comments);
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params._id} not found.`)
      );
    }
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);
    if (foundBlog) {
      const foundComment = await CommentsModel.findById(req.params.commentId);
      if (foundComment) {
        res.send(foundComment);
      } else {
        next(
          createHttpError(
            404,
            `Comment with the id: ${req.params._id} not found.`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params._id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);

    if (foundBlog) {
      const commentToInsert = new CommentsModel(req.body);

      const updatedBlog = await CommentsModel.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: commentToInsert } },
        { new: true, runValidators: true }
      );

      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with the id: ${req.body.id} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.put("/:id", async (req, res, next) => {
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

commentRouter.delete("/:id", async (req, res, next) => {
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

export default commentRouter;
