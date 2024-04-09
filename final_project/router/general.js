const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username) {
    return res.status(403).send(`Please enter an username!`)
  } else if (!password) {
    return res.status(403).send('Please enter a password')
  } else if (doesExist(username)) {
    return res.status(403).send('Username already taken!')
  } else {
    users.push({username, password})
    return res.status(300).send(`New user (${username}) added succesfully!`)
  }
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const books = await fetchBookList();
        return res.status(200).send(JSON.stringify(books, null, 2));
    } catch (error) {
        return res.status(500).send("Error: " + error.message)
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn

    getBookByISBN(isbn)
    .then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 2))
    })
    .catch((error) => {
        return res.status(400).send('Error: ' + error.message)
    })
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    getBooksByAuthor(author)
    .then((list_of_books) => {
        return res.status(200).send(JSON.stringify(list_of_books, null, 2))
    })
    .catch((error) => {
        return res.status(404).send('Error: ' + error.message)
    })
});
    
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  getBooksByTitle(title)
  .then((list_of_books)=> {
    return res.status(200).send(JSON.stringify(list_of_books, null, 4))
  })
  .catch((error) => {
    return res.status(404).send('Error: ' + error.message)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (isbn in books) {
      return res.status(300).send(`Reviews for ${books[isbn].title}, by ${books[isbn].author}: ` + JSON.stringify(books[isbn].reviews));
  } else {
    return res.status(403).send(`ISBN code (${isbn}) not found`)
  }
});

async function fetchBookList() {
    try {
        const response = books
        return response
    } catch (error) {
        throw new Error("Error Retrieving Books!")
    }
}

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
         }
    });
  }

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        let filtered_by_author = []
        for (const [key, value] of Object.entries(books)) {
            if (value.author === author){
                filtered_by_author.push(books[key])
            }
        }

    if (filtered_by_author.length > 0) {
            resolve(filtered_by_author)
        } else {
            reject(new Error("No books by this author"))
        }
        })
    }

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        let filtered_by_title = []
        for (const [key, value] of Object.entries(books)) {
            if (value.title === title){
                filtered_by_title.push(books[key])
            }
        }

    if (filtered_by_title.length > 0) {
            resolve(filtered_by_title)
        } else {
            reject(new Error("No books with this title!"))
        }
        })
    }
    

module.exports.general = public_users;
