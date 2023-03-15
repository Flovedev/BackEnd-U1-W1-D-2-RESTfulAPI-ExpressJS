import Express from "express";
import createHttpError from "http-errors";
import BlogsModel from "../blogs/model.js";
import CommentsModel from "./model.js";

const commentRouter = Express.Router();

commentRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);
    if (foundBlog) {
      res.send(foundBlog.comments);
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
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
      const foundComment = foundBlog.comments.find(
        (e) => e._id.toString() === req.params.commentId
      );
      if (foundComment) {
        res.send(foundComment);
      } else {
        next(
          createHttpError(
            404,
            `Comment with the id: ${req.params.commentId} not found.`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.post("/:id", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);

    if (foundBlog) {
      const commentToInsert = new CommentsModel(req.body);

      const updatedBlog = await BlogsModel.findByIdAndUpdate(
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

commentRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const foundBlog = await BlogsModel.findById(req.params.id);

    if (foundBlog) {
      const index = foundBlog.comments.findIndex(
        (e) => e._id.toString() === req.params.commentId
      );
      if (index !== -1) {
        foundBlog.comments[index] = {
          ...foundBlog.comments[index].toObject(),
          ...req.body,
        };
        await foundBlog.save();
        res.send(foundBlog);
      } else {
        next(
          createHttpError(
            404,
            `Comment with the id: ${req.params.commentId} not found.`
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

commentRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: req.params.commentId } } },
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

export default commentRouter;
