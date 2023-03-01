import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import cors from "cors";
import blogsRouter from "./api/blogs/index.js";

const server = Express();
const port = 3001;

server.use(cors());
server.use(Express.json());

server.use("/authors", authorsRouter);
server.use("/blogs", blogsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
