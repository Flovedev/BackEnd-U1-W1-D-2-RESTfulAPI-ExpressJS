import GoogleStragegy from "passport-google-oauth20";
import AuthorsModel from "../../api/authors/model.js";
import { createAccessToken } from "./tools.js";

const googleStragegy = new GoogleStragegy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    try {
      const { email, given_name, family_name, sub } = profile._json;
      console.log("PROFILE:", profile);
      const author = await AuthorsModel.findOne({ email });
      if (author) {
        const accessToken = await createAccessToken({
          _id: author._id,
          role: author.role,
        });
        passportNext(null, { accessToken });
      } else {
        const newAuthor = new AuthorsModel({
          name: given_name,
          surname: family_name,
          email,
          googleId: sub,
        });

        const createdAuthor = await newAuthor.save();

        const accessToken = await createAccessToken({
          _id: createdAuthor._id,
          role: createdAuthor.role,
        });

        passportNext(null, { accessToken });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

export default googleStragegy;
