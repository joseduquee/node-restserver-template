import express from 'express';
import cors from 'cors';
import { userRouter } from '../routes/user.routes.js'
import { dbConnection } from '../database/config.js';
import { authRouter } from '../routes/auth.routes.js';
import { categoryRouter } from '../routes/category.routes.js';
import { productRouter } from '../routes/product.routes.js';
import { searchRouter } from '../routes/search.routes.js';

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search'
    }

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
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.users, userRouter);
    this.app.use(this.paths.categories, categoryRouter);
    this.app.use(this.paths.products, productRouter);
    this.app.use(this.paths.search, searchRouter);
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
