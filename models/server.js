import express from "express";
import cors from 'cors';
import { router } from '../routes/user.routes.js'

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersPath = '/api/users';

    //Middlewares    
    this.middlewares();

    //Routes
    this.routes();

  }
  
  middlewares() {
    // Public folder
    this.app.use(express.static("public"));

    //Cors
    this.app.use(cors());

    //Reand and parse body
    this.app.use(express.json());

  }

  routes() {   
    this.app.use(this.usersPath, router);
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
