const express = require("express");

const router = express.Router();
const db = require("./userDb");
const postDb = require("../posts/postDb");


// GET all users
router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to retrieve users" });
    });
});


// GET a specific user by id
router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  db.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to retrieve this user" });
    });
});


// GET a specific users' posts
router.get("/:id/posts", validateUserId, (req, res) => {
  const userId = req.params.id;
  db.getUserPosts(userId)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to retrieve these posts" });
    });
});


// DELETE a specific user
router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to delete this user" });
    });
});


// PUT changes on a specific user
router.put("/:id", validateUserId, (req, res) => {
  const name = req.body;
  const id = req.params.id;
  db.update(id, name)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to save these changes" });
    });
});


// POST a, well, post from a specific user
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  // body of the post we need a user id
  // and we need a key:value pair 
  // the key is text
  const post = {
    "user_id":id,
    "text":req.body.text
  }
  postDb.insert(post)
  .then(response => {
    res.status(201).json({message:"Successfully posted!",response:response})
  })
  .catch(error => {
    res.status(500).json({message:error})
  })
});


// POST a new user
router.post("/", validateUser, (req, res) => {
  // add a user to the userdb
  const userObject = req.body;
  db.insert(userObject)
  .then(response => {
    res.status(201).json({message:response})
  })
  .catch(error => {
    res.status(500).json({message:"Could not add user :( :( :( User exists? ",error})
  })
});


// Custom Middleware
function validateUserId(req, res, next) {
// validate the user id
// check to see if the user is in the database
// 
  // console.log(req.params)
  let id = req.params.id;
  // id = parseInt(id);
  // console.log(id, typeof id);
  // if(id === 'NaN') {
  //   res.status(400).json({ "message":`${id} is not a number!` })
  // }
  db.getById(id)  
  .then(user => {
    if(!user) {
      res.status(400).json({message:"User not found!"})
    }
    next();
  })
  .catch(error => {
    res.status(500).json({error:error})
  });

}

function validateUser(req, res, next) {
 // use this middleware to validate the post is structured 
 // correctly
 // needs to have a body
  const body = req.body;
  const name = req.body.name;
  if(!body) {
    res.status(400).json({message:"Let's get that body! Because you need a body to proceed"})
  } 
  if(!name) {
    res.status(400).json({message:"Please include a name! Because you need a name to proceed"})
  }
  // Build a way to check to see user name is unique, possibly? 
  next();
}

function validatePost(req, res, next) {
  const body = req.body;
  const text = req.body.text;
  if(!body) {
    res.status(400).json({message:"Let's get that body! Because you need a body to proceed"})
  } 
  if(!text) {
    res.status(400).json({message:"Please include some text! Because you need to say something to proceed"})
  }
  next();

}

module.exports = router;


