import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = Express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
// console.log(authorsJSONPath);

authorsRouter.get("/", (req, res) => {
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);

  const authorsArray = JSON.parse(fileContentAsBuffer);

  res.send(authorsArray);
});

authorsRouter.get("/:id", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authorsArray.find((e) => e.ID === req.params.id);

  res.send(author);
});

authorsRouter.post("/", (req, res) => {
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    ID: uniqid(),
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const checkEmail = authorsArray.some((e) => e.email === req.body.email);

  if (checkEmail === true) {
    res.send("This email already exist, use a different one.");
  } else {
    authorsArray.push(newAuthor);

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

    res.status(201).send({ ID: newAuthor.ID });
  }

  // checkEmail === true ? res.status(404) : authorsArray.push(newAuthor);

  // fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  // res.status(201).send({ ID: newAuthor.ID });
});

authorsRouter.put("/:id", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex((e) => e.ID === req.params.id);
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.send(updatedAuthor);
});

authorsRouter.delete("/:id", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const remainingAuthors = authorsArray.filter((e) => e.ID !== req.params.id);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send();
});

export default authorsRouter;
