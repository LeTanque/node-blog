const moment = require("moment");
import express from 'express';

import usersRoutes from './users/userRouter'; // Same thing as old school require syntax
const postsRoutes = require("./posts/postRouter");


const server = express();
server.use(express.json()); // for every server connection, process using json()

server.use(logger);


server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware
function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  // const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a"); // <-- Cool moment syntax!!!
  const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a"); // <-- Cool moment syntax!!!

  console.log(`you made a ${method} request to ${url} at ${timestamp}`);
  next();
}

server.use("/api/users", usersRoutes);
server.use("/api/posts", postsRoutes);


module.exports = server;


// You don't have to use moment or import syntax in node.
// but if you do
// you're cool!

// in order to use the import syntax in node:
// npm install esm
// in your script
// do 
// nodemon -r esm index.js


