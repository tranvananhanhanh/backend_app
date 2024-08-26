const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let globalToken = null;  // Global variable to store the token


const isValid = (username) => {
  const userExists = users.some(user => user.username === username);
  return !userExists;
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);

  if (user) {
    return user.password === password;
  }

  return false;
};
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    globalToken = token;

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.body.token;

  const { review } = req.body;
  const isbn = req.params.isbn;

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    const username = decoded.username;

    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }

    const book = books[isbn];

    if (book) {
      book.reviews = book.reviews || {};
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
