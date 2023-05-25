import * as dotenv from 'dotenv';
dotenv.config();
import { response } from "express";
import { uploadFileHelper } from "../helpers/index.js";
import { User, Product } from "../models/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import cloudinary from 'cloudinary';

// cloudinary.config(process.env.CLOUDINARY_URL );
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
} catch (error) {
  console.log(error);
}


export const uploadFile = async (req, res = response) => {
  try {
    const name = await uploadFileHelper(req.files, undefined, "imgs");
    res.json({ name });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

export const updateImages = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a user with the id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a product with the id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Not yet implemented" });
  }

  //Clean previously images
  try {
    if (model.img) {
      const imgPath = path.join(__dirname, "../uploads", collection, model.img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }
  } catch (error) {
    console.log(error);
  }

  const name = await uploadFileHelper(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

export const updateImagesCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a user with the id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a product with the id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Not yet implemented" });
  }

  //Clean previously images
  try {
    if (model.img) {
      const nameArr = model.img.split('/');
      const name = nameArr[ nameArr.length -1 ];
      const [ public_id ] = name.split('.');
      cloudinary.uploader.destroy(`RestServer NodeJs/${collection}/${public_id}`)
    }
  } catch (error) {
    console.log(error);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath, {folder:`/RestServer NodeJs/${collection}`} );
  model.img = secure_url;
  await model.save();

  res.json(model);
};

export const showImage = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a user with the id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Dont exists a product with the id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Not yet implemented" });
  }

  //Clean previously images
  if (model.img) {
    const imgPath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }

  const pathNoImage = path.join(__dirname, "../assets", "no-image.jpg")
  res.sendFile(pathNoImage);

  const name = await uploadFileHelper(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};
