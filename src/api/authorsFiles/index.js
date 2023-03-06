import Express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import { saveAuthorsAvatars, getAuthors } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";

const authorsFilesRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "blogPosts/avatar" },
  }),
}).single("avatar");

authorsFilesRouter.post(
  "/:id/uploadAvatar",
  multer().single("avatar"),
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log("working");
      // const authorsArray = await getAuthors();
      // const author = authorsArray.find((e) => e.ID === req.params.id);
      // if (author) {
      //   const originalFileExtension = extname(req.file.originalname);
      //   const fileName = req.params.id + originalFileExtension;
      //   await saveAuthorsAvatars(fileName, req.file.buffer);

      //   res.send({ message: "file uploaded" });
      // } else {
      //   res.status(404).send(`Author with the id: ${req.params.id} not found.`);
      // }
    } catch (error) {
      next(error);
    }
  }
);

export default authorsFilesRouter;
