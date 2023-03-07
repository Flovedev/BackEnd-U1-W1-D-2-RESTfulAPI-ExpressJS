import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";
import { pipeline } from "stream";
import { saveBlogsCovers, getBlogs } from "../../lib/fs-tools.js";
import { getPDFRedeableStream } from "../../lib/pdf-tools.js";

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

blogsFilesRouter.get("/download/:id/pdf/", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const foundBlog = blogsArray.find((e) => e._id === req.params.id);

    if (foundBlog) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${foundBlog.title}.pdf`
      );
      const source = getPDFRedeableStream(foundBlog);
      const destination = res;

      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    } else {
      next(
        createHttpError(404, `Blog with the id: ${req.params._id} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogsFilesRouter;
