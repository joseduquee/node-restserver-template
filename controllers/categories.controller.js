import { response } from "express";
import { Category } from "../models/index.js";


export const getCategories = async(req, res = response) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }
    
    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .skip(from)
        .limit(limit)
        .populate('user', 'name')
    ])

    res.json({
        total,
        categories
      });
}

export const getCategory = async(req, res = response) => {

    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    // if(!category) {
    //     res.status(404).json({
    //         msg: `Category with ${ id } does not exists`
    //     })
    // }

    res.status(200).json(category);

}

export const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${categoryDB.name} does exists`,
    });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  //Save in DB
  await category.save();

  res.status(201).json(category);
};

export const updateCategory = async(req, res = response) => {
    const {id} = req.params;
    const { status, user, ...rest } = req.body;
    
    console.log(res);
    rest.name = rest.name.toUpperCase();
    res.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, rest, { new: true });

    res.json(category);
}

export const deleteCategory = async(req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });
    res.json(category);
}