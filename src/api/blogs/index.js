import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validation.js";

const blogsRouter = Express.Router();
const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const writeBlogs = (e) => fs.writeFileSync(blogsJSONPath, JSON.stringify(e));

blogsRouter.get("/", (req, res, next) => {
  try {
    const blogs = getBlogs();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});
blogsRouter.get("/:id", (req, res) => {
  try {
    const blogsArray = getBlogs();

    const foundBlog = blogsArray.find((e) => e.id === req.params.id);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      next(
        createHttpError(404, `Blog with the id:${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.post("/", checkBlogsSchema, triggerBadRequest, (req, res) => {
  const newBlog = {
    ...req.body,
    id: uniqid(),
    createdAt: new Date(),
    undatedAt: new Date(),
  };

  const blogsArray = getBlogs();
  blogsArray.push(newBlog);
  writeBlogs(blogsArray);

  res.status(201).send({ id: newBlog.id });
});
blogsRouter.put("/:id", (req, res) => {
  try {
    const blogsArray = getBlogs();
    const index = blogsArray.findIndex((e) => e.id === req.params.id);
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogsArray[index] = updatedBlog;

      writeBlogs(blogsArray);

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
blogsRouter.delete("/:id", (req, res) => {
  try {
    const blogsArray = getBlogs();

    const remainingBlogs = blogsArray.filter((e) => e.id !== req.params.id);

    if (blogsArray.length !== remainingBlogs.length) {
      writeBlogs(remainingBlogs);

      res.status(204).send("Blog deleted");
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
