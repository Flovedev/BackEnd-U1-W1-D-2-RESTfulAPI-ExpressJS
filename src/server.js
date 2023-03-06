import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import authorsRouter from "./api/authors/index.js";
import blogsRouter from "./api/blogs/index.js";
import authorsFilesRouter from "./api/authorsFiles/index.js";
import blogsFilesRouter from "./api/blogsFiles/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorsHandler.js";

const server = Express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");

server.use(Express.static(publicFolderPath));
server.use(cors());
server.use(Express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);

server.use("/authors", authorsFilesRouter);
server.use("/blogPosts", blogsFilesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
