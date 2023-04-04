import Express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
import q2m from "query-to-mongo";
import { basicAuth } from "../../lib/auth/basic.js";
import { adminOnly } from "../../lib/auth/admin.js";

const authorsRouter = Express.Router();

authorsRouter.get("/", basicAuth, adminOnly, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find({});
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:id", basicAuth, adminOnly, async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.id);
    if (author) {
      res.send(author);
    } else {
      next(
        res.status(404).send(`Author with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { _id } = await newAuthor.save();

    res.status(201).send({ NewAuthor: _id });
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:id", basicAuth, adminOnly, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(
        res.status(404).send(`Author with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:id", basicAuth, adminOnly, async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.id);

    if (deletedAuthor) {
      res.status(204).send();
    } else {
      next(
        res.status(404).send(`Author with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/me", basicAuth, async (req, res, next) => {
  try {
    res.send(req.author);
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
