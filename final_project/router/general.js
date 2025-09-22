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
  let getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not available");
    }
  });

  getBooks
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let getBook = new Promise((resolve, reject) => {
    let isbn = req.params.isbn;
    if (isbn) {
      let book = books[isbn];
      if (book) {
        resolve(JSON.stringify(book, null, 4));
      } else {
        reject("Book not found");
      }
    } else {
      reject("ISBN is required");
    }
  });

  getBook
    .then((data) => {
      return res.send(data);
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let getBook = new Promise((resolve, reject) => {
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
        resolve(JSON.stringify(booksByAuthor, null, 4));
      } else {
        reject("No books found by this author");
      }
    } else {
      reject("Author is required");
    }
  });

  getBook
    .then((data) => {
      return res.send(data);
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let getBook = new Promise((resolve, reject) => {
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
        resolve(JSON.stringify(booksByTitle, null, 4));
      } else {
        reject("No books found with this title");
      }
    } else {
      reject("Title is required");
    }
  });

  getBook
    .then((data) => {
      return res.send(data);
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
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
