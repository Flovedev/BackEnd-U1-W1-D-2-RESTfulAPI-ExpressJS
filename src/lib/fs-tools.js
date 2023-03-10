import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createReadStream, createWriteStream } from "fs";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogsJSONPath = join(dataFolderPath, "blogs.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");
const blogsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts");

export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray);
export const getBlogs = () => readJSON(blogsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogsJSONPath, blogsArray);
export const writeComments = (commentsArray) =>
  writeJSON(commentsJSONPath, commentsArray);

export const saveAuthorsAvatars = (fileName, fileContentAsBuffer) =>
  writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer);
export const saveBlogsCovers = (fileName, fileContentAsBuffer) =>
  writeFile(join(blogsPublicFolderPath, fileName), fileContentAsBuffer);

export const getCsvJSONReadablesStream = () => createReadStream(blogsJSONPath);
export const getPDFWriteableStream = () =>
  createWriteStream(join(dataFolderPath, filename));
