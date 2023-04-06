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
      const user = await AuthorsModel.findOne({ email });
      if (user) {
        const accessToken = await createAccessToken({
          _id: user._id,
          role: user.role,
        });
        passportNext(null, { accessToken });
      } else {
        const newUser = new AuthorsModel({
          name: given_name,
          surname: family_name,
          email,
          googleId: sub,
        });

        const createdUser = await newUser.save();

        const accessToken = await createAccessToken({
          _id: createdUser._id,
          role: createdUser.role,
        });

        passportNext(null, { accessToken });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

export default googleStragegy;
