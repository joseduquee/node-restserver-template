import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("It could not generate the token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const checkJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }
    const { uid } = jwt.verify(token, process.env.SECRETKEY);
    const user = await User.findById(uid);

    if (user) {
      if (user.status) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};
