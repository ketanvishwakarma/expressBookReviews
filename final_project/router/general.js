const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "Username and password are required" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      return res.send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "ISBN is required" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  if (author) {
    let booksByAuthor = [];
    for (let isbn in books) {
      let book = books[isbn];
      if (book.author === author) {
        booksByAuthor.push(book);
      }
    }
    if (booksByAuthor.length > 0) {
      return res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } else {
    return res.status(400).json({ message: "Author is required" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  if (title) {
    let booksByTitle = [];
    for (let isbn in books) {
      let book = books[isbn];
      if (book.title === title) {
        booksByTitle.push(book);
      }
    }
    if (booksByTitle.length > 0) {
      return res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } else {
    return res.status(400).json({ message: "Title is required" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "ISBN is required" });
  }
});

module.exports.general = public_users;
