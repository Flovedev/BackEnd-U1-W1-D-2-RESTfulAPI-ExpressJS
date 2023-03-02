import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validation.js";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";

const blogsRouter = Express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const foundBlog = blogsArray.find((e) => e._id === req.params.id);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      next(
        res.status(404).send(`Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", checkBlogsSchema, triggerBadRequest, async (req, res) => {
  try {
    const newBlog = {
      ...req.body,
      _id: uniqid(),
      createdAt: new Date(),
      undatedAt: new Date(),
      comments: [],
    };

    const blogsArray = await getBlogs();
    blogsArray.push(newBlog);
    writeBlogs(blogsArray);

    res.status(201).send({ NewBlog: newBlog._id });
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const index = blogsArray.findIndex((e) => e._id === req.params.id);
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogsArray[index] = updatedBlog;

      writeBlogs(blogsArray);

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

blogsRouter.delete("/:id", (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const remainingBlogs = blogsArray.filter((e) => e._id !== req.params.id);

    if (blogsArray.length !== remainingBlogs.length) {
      writeBlogs(remainingBlogs);

      res.status(204).send("Blog deleted");
    } else {
      //   next(
      //     createHttpError(404, `Blog with the id: ${req.params.id} not found.`)
      //   );
      res.status(404).send(`Blog with the id: ${req.params.id} not found.`);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const foundBlog = blogsArray.find((e) => e._id === req.params.id);
    if (foundBlog) {
      res.send(foundBlog.comments);
    } else {
      next(
        res.status(404).send(`Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      _id: uniqid(),
      createdAt: new Date(),
      undatedAt: new Date(),
    };
    const blogsArray = await getBlogs();
    const foundBlog = blogsArray.find((e) => e._id === req.params.id);

    if (foundBlog) {
      foundBlog.comments.push(newComment);
      writeBlogs(foundBlog.comments);
      res.status(201).send({ NewComment: newComment._id });
    } else {
      next(
        res.status(404).send(`Blog with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
