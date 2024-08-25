const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


async function getAlllbook() {
  try {
    const response = await axios.get('http://localhost:5000/'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error; 
  }
}

async function getAllisbn() {
  try {
    const response = await axios.get('http://localhost:5000/sbn/:isbn'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching isbn:', error);
    throw error; 
  }
}
async function getAllauthor() {
  try {
    const response = await axios.get('http://localhost:5000/author/:author'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching author:', error);
    throw error; 
  }
}

async function getAllauthor() {
  try {
    const response = await axios.get('http://localhost:5000/title/:title'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching title:', error);
    throw error; 
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Error : No username or password ' });
  }
  if(users[username]){
    return res.status(400).json({ message: "Username already exists" });
  }

  users[username] = {password};
  res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Return the books object in the desired format
  if (Object.keys(books).length > 0) {
    res.status(200).json(books); // Return the books object
  } else {
    res.status(404).json({ message: "No books available" }); // Handle no books scenario
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      res.status(200).json(book);
  } else {
      res.status(404).json({ message: "No book" });
  }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorGet = req.params.author.toLowerCase();
  console.log(authorGet);
  const authorBooks = [];

  for (let key in books) {
      if (books[key].author.toLowerCase() === authorGet) {
          authorBooks.push(books[key]);
      }
  }
  if (authorBooks.length > 0) {
      return res.status(200).json(authorBooks);
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleGet = req.params.title.toLowerCase();
  console.log(titleGet);
  const bookTitles = [];

  for (let key in books) {
      if (books[key].title.toLowerCase() === titleGet) {
          bookTitles.push(books[key]);
      }
  }
  if (bookTitles.length > 0) {
      return res.status(200).json(bookTitles);
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const isbnBook = books[isbn];

  if (isbnBook && isbnBook.reviews) {
      res.status(200).json(isbnBook.reviews);
  } else {
      res.status(404).json({ message: "Book not found or no reviews available" });
  }
});

module.exports.general = public_users;
