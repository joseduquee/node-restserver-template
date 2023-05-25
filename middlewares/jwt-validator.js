import { request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const jwtValidator = async(req = request, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: 'There is no a token in the request',
    });
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRETKEY);

    const user = await User.findById( uid );

    if( !user ) {
        return res.status(401).json({
            msg: 'User does not exists in BD'
        })
    }

    if(!user.status){
        return res.status(401).json({
            msg: 'User was already deleted with status false'
        })
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token not valid",
    });
  }
};
