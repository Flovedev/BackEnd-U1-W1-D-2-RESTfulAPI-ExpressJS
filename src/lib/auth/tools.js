import jwt from "jsonwebtoken";
import AuthorsModel from "../../api/authors/model.js";
import createHttpError from "http-errors";

export const createTokens = async (user) => {
  const accessToken = await createAccessToken({
    _id: user._id,
    role: user.role,
  });
  const refreshToken = await createRefreshToken({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    })
  );

const createRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.REFRESH_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    })
  );

export const verifyTokenAndCreateNewToken = async (currentRefreshToken) => {
  try {
    const { _id } = await verifyRefreshToken(currentRefreshToken);
    const author = await AuthorsModel.findById(_id);
    if (author) {
      const { accessToken, refreshToken } = await createTokens(author);

      return { accessToken, refreshToken };
    } else {
      throw new createHttpError(401, "Refresh token not valid");
    }
  } catch (error) {
    throw new createHttpError(401, "Please log in again");
  }
};
