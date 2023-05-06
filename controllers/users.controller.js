import { response } from "express";

export const usersGet = (req = request, res = response) => {
  
  const { q, name = 'No name', apikey, page = 1, limit } = req.query;
  
  res.json({
    msg: "get api - controller",
    q, 
    name, 
    apikey, 
    page, 
    limit
  });
};

export const usersPost = (req, res = response) => {
  
  const { name, age } = req.body;
  
  res.status(201).json({
    msg: "post api - controller",
    name, age
  });
};

export const usersPut = (req, res = response) => {
  
  const id = req.params.id;
  
  res.status(400).json({
    msg: "put api - controller",
    id
  });
};

export const usersPath = (req, res = response) => {
  res.json({
    msg: "patch api - controller",
  });
};

export const usersDelete = (req, res = response) => {
  res.json({
    msg: "delete api - controller",
  });
};
