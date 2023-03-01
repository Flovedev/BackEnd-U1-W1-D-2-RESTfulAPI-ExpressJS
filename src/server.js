import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import cors from "cors";
import blogsRouter from "./api/blogs/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorsHandler.js";

const server = Express();
const port = 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Flo";
  next();
};

const checkForUser = (req, res, next) => {
  if (req.user === "Flo") {
    next();
  } else {
    res.status(401).send({ message: "Allow only for Flo" });
  }
};

server.use(cors());
server.use(loggerMiddleware);
server.use(checkForUser);
server.use(Express.json());

server.use("/authors", authorsRouter);
server.use("/blogs", blogsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
