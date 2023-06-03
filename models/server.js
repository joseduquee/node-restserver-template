import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { userRouter } from "../routes/user.routes.js";
import { dbConnection } from "../database/config.js";
import { authRouter } from "../routes/auth.routes.js";
import { categoryRouter } from "../routes/category.routes.js";
import { productRouter } from "../routes/product.routes.js";
import { searchRouter } from "../routes/search.routes.js";
import { uploadRouter } from "../routes/upload.routes.js";

//import for sockets
import { createServer } from "http";
import { Server as ServerSocket } from "socket.io";
import { socketController } from "../sockets/socketController.js";

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //Socket config to use
    this.serverSocketIo = createServer(this.app);
    this.io = new ServerSocket(this.serverSocketIo);

    this.paths = {
      auth: "/api/auth",
      users: "/api/users",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      uploads: "/api/uploads",
    };

    //Connect to DB
    this.databaseConnect();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();

    //Sockets
    this.socketsEvents();
  }

  async databaseConnect() {
    await dbConnection();
  }

  //Sockets

  middlewares() {
    //Cors
    this.app.use(cors());

    //Reand and parse body
    this.app.use(express.json());

    // Public folder
    this.app.use(express.static("public"));

    //FileUpload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.users, userRouter);
    this.app.use(this.paths.categories, categoryRouter);
    this.app.use(this.paths.products, productRouter);
    this.app.use(this.paths.search, searchRouter);
    this.app.use(this.paths.uploads, uploadRouter);
  }

  socketsEvents(){
    
    this.io.on('connection', (socket) => socketController(socket, this.io));
  };

  listen() {
    this.serverSocketIo.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}
