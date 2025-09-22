const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  if (isValid(username)) {
    let validUsers = users.filter((user) => {
      return user.username === username && user.password === password;
    });
    return validUsers.length > 0;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({
        message: "User successfully logged in",
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Login. Check username and password" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  if (isbn) {
    if (review) {
      let book = books[isbn];
      if (book) {
        if (book.reviews[username]) {
          book.reviews[username] = review;
          return res.status(200).json({
            message: "Review updated successfully",
          });
        } else {
          book.reviews[username] = review;
          return res.status(200).json({
            message: "Review added successfully",
          });
        }
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      return res.status(400).json({ message: "Review is required" });
    }
  } else {
    return res.status(400).json({ message: "ISBN is required" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      let userBookReview = book.reviews[username];
      if (userBookReview) {
        delete book.reviews[username];
        return res.status(200).json({
          message: "Review deleted successfully",
        });
      } else {
        return res.status(404).json({ message: "Review not found" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "ISBN is required" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
