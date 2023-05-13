import { response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";

export const usersGet = async(req = request, res = response) => {

  const { limit = 5, from = 0 } = req.query;
  const query = { status: true }


  const [ total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
    .skip(from)
    .limit(limit)
  ])

  res.json({
    total,
    users
  });
};

export const usersPost = async(req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  //Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.status(201).json({
    user,
  });
};

export const usersPut = async(req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    //Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate( id, rest );

  res.status(400).json({
    user,
  });
};

export const usersPath = (req, res = response) => {
  res.json({
    msg: "patch api - controller",
  });
};

export const usersDelete = async(req, res = response) => {
  
  const { id } = req.params;

  //Delete it from DB
  //Not recommended
  //const user = await User.findByIdAndDelete( id );

  const user = await User.findByIdAndUpdate( id, { status: false } );
  
  res.json(user);
};
