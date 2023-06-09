import { json, response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

export const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Email does not exists",
      });
    }

    if (!user.status) {
      return res.status(400).json({
        msg: "Status disabled",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Passwor is wrong",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Something failed",
    });
  }
};

export const googleSignIn = async (req, resp) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: "(:",
        img,
        role: "USER_ROLE",
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return resp.status(401).json({
        msg: "User is blocked. Contact Administrator",
      });
    }

    //Generate JWT
    const token = await generateJWT(user.id);

    resp.json({
      user,
      token,
    });
  } catch (error) {
    resp.status(400).json({
      ok: error,
      msg: "Toke cound not verify",
    });
  }
};
