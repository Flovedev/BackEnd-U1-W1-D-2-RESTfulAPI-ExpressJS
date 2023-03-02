import Express from "express";
import multer from "multer";
import { extname } from "path";
import { saveBlogsCovers, getBlogs } from "../../lib/fs-tools.js";

const blogsFilesRouter = Express.Router();

blogsFilesRouter.post(
  "/:id/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      const blogsArray = await getBlogs();
      const blog = blogsArray.find((e) => e._id === req.params.id);
      if (blog) {
        const originalFileExtension = extname(req.file.originalname);
        const fileName = req.params.id + originalFileExtension;
        await saveBlogsCovers(fileName, req.file.buffer);

        res.send({ message: "file uploaded" });
      } else {
        res.status(404).send(`Blog with the id: ${req.params.id} not found.`);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogsFilesRouter;
