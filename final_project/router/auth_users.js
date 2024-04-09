const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
let books = require("./booksdb.js");
const regd_users = express.Router();

const public_users = express.Router();



let users = [{"username":"igor", "password":"pwd123"}, {"username":"alline", "password":"pwd3007"}];

const isValid = (username)=> { 
    const users_with_same_username = users.filter((user) => user.username === username)
    if (users_with_same_username.length > 0) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password)=>{ 
    const users_with_same_username = users.filter((user) => {
        return user.username === username && user.password === password 
    })

    if (users_with_same_username.length > 0) {
        // console.log('true' + users_with_same_username + username + password)
        return true
    } else {
        // console.log('false' + users_with_same_username + username + password)
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in. Try again!'})
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 30 })

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send(`${username} logged in succesfully!`)
  } else {
    return res.status(403).send('Invalid login. Check details and try again.')
  }
}); 
 

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.query.review
    const user = req.session.authorization.username

    if (!books[isbn].reviews[user]) {
        books[isbn].reviews[user] = review
        return res.status(300).send(`Review added succesfully to '${books[isbn].title}'!`)
    } else {
        books[isbn].reviews[user] = review
        return res.status(300).send(`Review replaced succesfully!`)
    }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const user = req.session.authorization.username
    if (user in books[isbn].reviews) {
        delete books[isbn].reviews[user]
        return res.status(300).send('Review Deleted Succesfully!')
    } else {
        return res.status(404).send('No reviews from this user for this book.')
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
