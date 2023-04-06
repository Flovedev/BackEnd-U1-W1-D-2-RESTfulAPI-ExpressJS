import Express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
import q2m from "query-to-mongo";
import { adminOnly } from "../../lib/auth/admin.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwt.js";
import {
  createTokens,
  verifyTokenAndCreateNewToken,
} from "../../lib/auth/tools.js";
import passport from "passport";

const authorsRouter = Express.Router();

authorsRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authorsRouter.get(
  "googleRedirect",
  passport.authenticate("google", { session: false }),
  (req, res, next) => {
    try {
      res.redirect(
        `${process.env.FE_DEV_URL}?accessToken=${req.author.accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

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

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const author = await AuthorsModel.checkCredentials(email, password);

    if (author) {
      const { accessToken, refreshToken } = await createTokens(author);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/refreshTokens", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;

    const { accessToken, refreshToken } = await verifyTokenAndCreateNewToken(
      currentRefreshToken
    );

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
