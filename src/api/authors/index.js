import Express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
import q2m from "query-to-mongo";
import { adminOnly } from "../../lib/auth/admin.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwt.js";

const authorsRouter = Express.Router();

authorsRouter.get("/", JWTAuthMiddleware, adminOnly, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find({});
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get(
  "/:id",
  JWTAuthMiddleware,
  adminOnly,
  async (req, res, next) => {
    try {
      const author = await AuthorsModel.findById(req.params.id);
      if (author) {
        res.send(author);
      } else {
        next(
          res
            .status(404)
            .send(`Author with the id: ${req.params.id} not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { _id } = await newAuthor.save();

    res.status(201).send({ NewAuthor: _id });
  } catch (error) {
    next(error);
  }
});

authorsRouter.put(
  "/:id",
  JWTAuthMiddleware,
  adminOnly,
  async (req, res, next) => {
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
          res
            .status(404)
            .send(`Author with the id: ${req.params.id} not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  adminOnly,
  async (req, res, next) => {
    try {
      const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.id);

      if (deletedAuthor) {
        res.status(204).send();
      } else {
        next(
          res
            .status(404)
            .send(`Author with the id: ${req.params.id} not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// authorsRouter.get("/me/stories", basicAuth, async (req, res, next) => {
//   try {
//     res.send(req.author);
//   } catch (error) {
//     next(error);
//   }
// });

// authorsRouter.put("/me/stories", basicAuth, async (req, res, next) => {
//   try {
//     const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
//       req.author._id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     res.send(updatedAuthor);
//   } catch (updatedAuthor) {
//     next(error);
//   }
// });

// authorsRouter.delete("/me/stories", basicAuth, async (req, res, next) => {
//   try {
//     await AuthorsModel.findByIdAndDelete(req.author._id);
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

export default authorsRouter;
