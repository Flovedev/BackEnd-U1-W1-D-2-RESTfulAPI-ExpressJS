import { Transform } from "@json2csv/node";
import Express from "express";
import { getCsvJSONReadablesStream } from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { sendsRegistrationEmail } from "../../lib/email-tools.js";

const csvRouter = Express.Router();

csvRouter.get("/", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=test.csv");
    const source = getCsvJSONReadablesStream();
    const transform = new Transform({ fields: ["asin", "title", "category"] });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

csvRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendsRegistrationEmail(email);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default csvRouter;
