import Express from "express";
import uniqid from "uniqid";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = Express.Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    res.send(authorsArray);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const author = authorsArray.find((e) => e.ID === req.params.id);
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
    const authorsArray = await getAuthors();
    const newAuthor = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      ID: uniqid(),
    };
    const checkEmail = authorsArray.some((e) => e.email === req.body.email);
    if (checkEmail === true) {
      next(res.send("This email already exist, use a different one."));
    } else {
      authorsArray.push(newAuthor);

      await writeAuthors(authorsArray);

      res.status(201).send("Author created!");
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const index = authorsArray.findIndex((e) => e.ID === req.params.id);
    if (index !== -1) {
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      writeAuthors(authorsArray);
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

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const remainingAuthors = authorsArray.filter((e) => e.ID !== req.params.id);
    if (authorsArray.length !== remainingAuthors.length) {
      writeAuthors(remainingAuthors);
      res.status(204).send("Author deleted");
    } else {
      next(
        res.status(404).send(`Author with the id: ${req.params.id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
