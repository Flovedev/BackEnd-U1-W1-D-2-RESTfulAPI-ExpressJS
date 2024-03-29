import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import authorsRouter from "./api/authors/index.js";
import blogsRouter from "./api/blogs/index.js";
import authorsFilesRouter from "./api/authorsFiles/index.js";
import blogsFilesRouter from "./api/blogsFiles/index.js";
import csvRouter from "./api/CSV/index.js";
import createHttpError from "http-errors";
import {
  badRequestHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorsHandler.js";
import mongoose from "mongoose";
import commentRouter from "./api/comments/index.js";
import passport from "passport";
import googleStragegy from "./lib/auth/googleOauth.js";

const server = Express();
const port = process.env.PORT || 3001;
const publicFolderPath = join(process.cwd(), "./public");
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

passport.use("google", googleStragegy);

server.use(Express.static(publicFolderPath));
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      // corsNext(null, true);
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);
server.use(Express.json());
server.use(passport.initialize());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);
server.use("/blogPosts", commentRouter);

// server.use("/authors", authorsFilesRouter);
// server.use("/blogPosts", blogsFilesRouter);

// server.use("/csv", csvRouter);

server.use(badRequestHandler);
server.use(forbiddenErrorHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    // console.table(listEndpoints(server));
    console.log(port, "Connected! WEY");
  });
});
