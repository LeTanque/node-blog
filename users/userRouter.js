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

router.put("/:id", validateUserId, validateUser, (req, res) => {
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
  const user_id = req.params.id;
  const text = req.body.text;
  const post = {
    user_id: `${user_id}`,
    text: `${text}`
  };
  postDb
    .insert(post)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to add your post" });
    });
});

// POST a new user

router.post("/", validateUser, (req, res) => {
  const body = req.body;
  db.insert(body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The server was unable to add your user" });
    });
});

// Custom Middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  db.getById(id)
    .then(user => {
      if (user) {
        next();
      } else {
        res.status(404).json({ message: "Invalid user id" });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The server was unable to validate this id" });
    });
}

function validateUser(req, res, next) {
  let body = req.body;
  if (body && body.name) {
    next();
  } else {
    res.status(404).json({ message: "Please include all required fields" });
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  if (body && body.text) {
    next();
  } else {
    res.status(404).json({ message: "Please include all required fields" });
  }
}

module.exports = router;
