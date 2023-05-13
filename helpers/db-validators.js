import { Role } from "../models/role.js";
import { User } from "../models/user.js";

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
