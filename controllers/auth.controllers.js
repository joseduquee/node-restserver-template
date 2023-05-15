import { response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-jwt.js";

export const login = async (req = request, res = response) => {
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({
        msg: 'Email does not exists'
      })
    }

    if(!user.status) {
      return res.status(400).json({
        msg: 'Status disabled'
      })
    }

    const validPassword = bcryptjs.compareSync( password, user.password);
    if( !validPassword ){
      return res.status(400).json({
        msg: 'Passwor is wrong'
      })
    }

    const token = await generateJWT( user.id );

    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Something failed",
    });
  }
};
