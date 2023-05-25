import { response } from "express";
import { Product } from "../models/index.js";

export const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(from)
      .limit(limit)
      .populate("user", "name")
      .populate("category", "name"),
  ]);

  res.json({
    total,
    products,
  });
};

export const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.status(200).json(product);
};

export const createProduct = async (req, res = response) => {
  const { status, user, ...body } = req.body;

  const productDB = await Product.findOne({name:body.name.toUpperCase()});

  if (productDB) {
    return res.status(400).json({
      msg: `Product ${productDB.name} does exists`,
    });
  }

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);
  await product.save();

  return res.status(201).json(product);
};

export const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...rest } = req.body;

  if (rest.name) {
    rest.name = rest.name.toUpperCase();
  }

  rest.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, rest, { new: true });

  res.json(product);
};

export const deleteProduct = async(req, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
    res.json(product);
}