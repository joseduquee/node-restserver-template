import { Category, Product, Role, User } from "../models/index.js";

export const isRoleValid = async (role = "") => {
  const existsRol = await Role.findOne({ role });
  if (!existsRol) {
    throw new Error(`Role ${rol} does not exists in DB`);
  }
};

export const existsEmail = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`Email ${email} is already in use`);
  }
};

export const existsUserById = async (id = "") => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error(`Id ${id} does not exists`);
  }
};

export const existsCategoryById = async (id = "") => {
  const existsCategory = await Category.findById(id);
  if (!existsCategory) {
    throw new Error(`Id ${id} does not exists`);
  }
};

export const existsProductById = async (id = "") => {
  const existsProduct = await Product.findById(id);
  if (!existsProduct) {
    throw new Error(`Id ${id} does not exists`);
  }
};

/**
 * Collections validator
 */
export const collectionsAllow = ( collection = '', collections = []) => {
  const included = collections.includes( collection);
  if(!included) {
    throw new Error(`Collection ${ collection } isn't allowed, ${collections}`);
  }
  return true;
}
