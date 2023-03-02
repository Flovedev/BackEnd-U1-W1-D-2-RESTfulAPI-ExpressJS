import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogsSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover link is a mandatory field and needs to be a string!",
    },
  },
  // readTime: {
  //     in: ["body"],
  //     isArray: {
  //       errorMessage: "Cover link is a mandatory field and needs to be a string!",
  //     },
  //   },
  // author: {
  //     in: ["body"],
  //     isArray: {
  //       errorMessage: "Cover link is a mandatory field and needs to be a string!",
  //     },
  //   },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string!",
    },
  },
};

export const checkBlogsSchema = checkSchema(blogsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during validation", {
        errorsList: errors.array(),
      })
    );
  }
};
