import createHttpError from "http-errors";

export const adminOnly = (req, res, next) => {
  if (req.author.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Admins only endpoint!"));
  }
};
