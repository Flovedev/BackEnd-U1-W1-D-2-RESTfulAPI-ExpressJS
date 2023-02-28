import Express from "express";
import listEndpoints from "express-list-endpoints";
import router from "./api/authors/index.js";
import cors from "cors";

const server = Express();
const port = 3001;

server.use(Express.json());

server.use("/authors", router);
server.use(cors());

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
