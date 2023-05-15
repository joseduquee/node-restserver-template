import express from 'express';
import cors from 'cors';
import { router } from '../routes/user.routes.js'
import { dbConnection } from '../database/config.js';
import { authRouter } from '../routes/auth.routes.js';

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    this.authPath = '/api/auth';

    //Connect to DB
    this.databaseConnect();

    //Middlewares    
    this.middlewares();

    //Routes
    this.routes();

  }

  async databaseConnect() {
    await dbConnection();
  }
  
  middlewares() {
    
    //Cors
    this.app.use(cors());
    
    //Reand and parse body
    this.app.use(express.json());
    
    // Public folder
    this.app.use(express.static("public"));
  }

  routes() {   
    this.app.use(this.authPath, authRouter);
    this.app.use(this.usersPath, router);
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
