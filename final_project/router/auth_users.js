const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [{
   username: 'testuser',
   password: 'testpassword'
}];
const jwtSecret = process.env.JWTKEY; 

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
if (user) {
    return user.password === password;
}
return false;

}

regd_users.post("/login", (req, res) => {
  //write code to check is the username is valid
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Error: Username and password are required' });
  }
  if (authenticatedUser(username, password)) {
    const tokenAccess = jwt.sign({ username }, "nathan", { expiresIn: '1h' });


    req.session.token = {tokenAccess,username};

    return res.status(200).json({ message: 'User successfully logged in', token: tokenAccess });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.token.username;
  const review = req.query.review;
  const book = books[req.params.isbn];

  if (!review) {
    return res.status(400).json({ message: 'Bad request. No review provided' });
  }

  const isNewReview = !book.reviews[username];
  book.reviews[username] = review;

  return res.status(200).json({ message: `Review was ${isNewReview ? 'added' : 'updated'}` });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.token.username;
  const isbn = req.params.isbn;

  console.log("Books:", books);
  console.log("ISBN:", isbn);

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!book.reviews) {
    return res.status(404).json({ message: 'No reviews found for this book' });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: 'Review not found' });
  }

  delete book.reviews[username];

  return res.status(200).json({ message: 'Review deleted' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
