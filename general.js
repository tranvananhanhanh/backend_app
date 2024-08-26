const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

// Async callback function to get the list of books
function fetchBooks(callback) {
  setTimeout(() => {
    callback(null, books); // Call the callback with null error and the data (books)
  }, 1000); // Simulate a 1-second delay to mimic async behavior
}

// Route to get all books using async callback
public_users.get('/', (req, res) => {
  fetchBooks((error, data) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
    return res.status(200).json(data);
  });
});

function fetchBookByISBN(isbn, callback) {
  // Simulate an async operation using a Promise
  setTimeout(() => {
    const book = books[isbn];
    if (book) {
      callback(null, book); // Call the callback with null error and book data
    } else {
      callback(new Error("Book not found"), null); // Call the callback with an error
    }
  }, 1000); // Simulate a 1-second delay
}
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  fetchBookByISBN(isbn, (error, book) => {
    if (error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(200).json(book);
  });
});

function fetchBooksByAuthor(authorName, callback) {
  // Simulate an async operation using a Promise
  setTimeout(() => {
    const booksByAuthor = Object.values(books).filter(
      book => book.author.toLowerCase() === authorName.toLowerCase()
    );
    if (booksByAuthor.length > 0) {
      callback(null, booksByAuthor); // Call the callback with null error and the books
    } else {
      callback(new Error("Books by this author not found"), null); // Call the callback with an error
    }
  }, 1000); // Simulate a 1-second delay
}
public_users.get('/author/:author', (req, res) => {
  const authorName = req.params.author;

  fetchBooksByAuthor(authorName, (error, booksByAuthor) => {
    if (error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(200).json(booksByAuthor);
  });
});
function fetchBooksByTitle(title, callback) {
  setTimeout(() => {
    const booksByTitle = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );
    if (booksByTitle.length > 0) {
      callback(null, booksByTitle); // Call callback with books data
    } else {
      callback(new Error("Books with this title not found"), null); // Call callback with error
    }
  }, 1000); // Simulate a 1-second delay
}
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  fetchBooksByTitle(title, (error, booksByTitle) => {
    if (error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(200).json(booksByTitle);
  });
});

 




// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  // Lấy ISBN từ tham số URL
  const isbn = req.params.isbn;

  // Tìm sách dựa trên ISBN
  const book = books[isbn];

  if (book && book.reviews) {
      // Nếu sách tồn tại và có đánh giá, trả về danh sách đánh giá
      return res.status(200).json(book.reviews);
  } else {
      // Nếu không có sách hoặc không có đánh giá, trả về lỗi 404
      return res.status(404).json({ message: "Reviews for this book not found" });
  }
});


public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem username và password có được cung cấp không
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Kiểm tra xem username đã tồn tại chưa
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  } else {
    // Thêm người dùng mới vào danh sách người dùng
    users.push({ username, password });

    // Trả về phản hồi thành công
    return res.status(200).json({ message: "User registered successfully" });
  }
});


module.exports.general = public_users;
