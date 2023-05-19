import { response } from "express";
import { User, Category, Product } from "../models/index.js";
import { isValidObjectId } from "mongoose";

const allowCollections = ["categories", "products", "roles", "users"];

const searchUser = async( term = '', res = response) => {
    const isMongoId = isValidObjectId( term );
    if(isMongoId) {
        const user = await User.findById( term );
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i')

    const users = await User.find({ 
        $or: [
            {name: regex},
            {email: regex}
        ],
        "$and": [{ status: true }]
     });

    res.json({
        results: users
    });
};

const searchCategories = async( term = '', res = response) => {
    const isMongoId = isValidObjectId( term );
    if(isMongoId) {
        const category = await Category.findById( term );
        return res.json({
            results: ( category ) ? [ category ] : []
        });
    }

    const regex = new RegExp( term, 'i')

    const categories = await Category.find({ name: regex, status: true });

    res.json({
        results: categories
    });
};

const searchProducts = async( term = '', res = response) => {
    const isMongoId = isValidObjectId( term );
    if(isMongoId) {
        const product = await Product.findById( term ).populate('category', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp( term, 'i')

    const products = await Product.find({ 
        $or: [
            {name: regex},
            {description: regex}
        ],
        "$and": [{ status: true }]
     }).populate('category', 'name');

    res.json({
        results: products
    });
};

export const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!allowCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are: ${allowCollections}`,
    });
  }

  switch (collection) {
    case "users":
        searchUser(term, res);
        break;
    case "products":
        searchProducts(term, res);
        break;
    case "categories":
        searchCategories(term, res);
        break;
    default:
      res.status(500).json({
        msg: "Not search implemented",
      });
  }
};
