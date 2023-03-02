import Express from "express";
import multer from "multer";
import { extname } from "path";
import { saveAuthorsAvatars } from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post("/", multer().single("avatar"), async (req, res, next) => {
  try {
    // const originalFileExtension = extname(req.file.originalname);
    // const fileName = req.params.id + originalFileExtension;
    // await saveAuthorsAvatars(fileName, req.file.buffer);

    await saveAuthorsAvatars(req.file.originalname, req.file.buffer);

    res.send({ message: "file uploaded" });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
