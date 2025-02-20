const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let user= req.body.username;
  let password=req.body.password;
  if (!user || !password) {
    return res.status(400).json({ message: "Credenciales vacías" });
  }
  let existingUser = users.find(u => u.username === user);
  if (existingUser) {
    return res.status(400).json({ message: "Usuario ya existente" });
  }
  // Agregar el nuevo usuario a la lista de usuarios
  users.push({ username: user, password: password });
  return res.status(201).json({ message: "Usuario creado" ,Usuarios:users});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let promise =new Promise((resolve,reject)=>{
    resolve(JSON.stringify(books))
  })
  promise.then((mensaje)=>{
    return res.status(300).send(mensaje);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async(req, res)=>{
  let ISBN = req.params.isbn;
  if(!books[ISBN]){
    return res.status(300).json({message: "Book not found"});
  }
  let book=books[ISBN];
  return res.status(300).json({book});
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=>{
  let author = req.params.author;
  let author_books = []; 
  for (let i in books){
    if(books[i].author == author){
      author_books.push(books[i]);
    }
  }
  if(author_books.length == 0){
    return res.status(300).json({message: "Author not found"});
  } 
  return res.status(300).json({author_books});
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=>{
  let title= req.params.title;
  let book;
  for(let b in books){
    if(books[b].title==title){
     book=books[b];
    }

  }
  if(book!=null){
    res.status(300).json(book)
  }else{
    res.status(404).json({message:"Libro no encontrado"})
  }

});

//  Get book review
public_users.get('/review/:isbn',async (req, res)=> {
  let isbn=req.params.isbn;
  let libro;
  if(isbn!=null){
    libro=books[isbn]; 
  }else{
    return res.json({message:"ISBN no valid"})
  }
  if(libro!=null){
  return res.status(300).json(libro.reviews)
  }else{
    return res.status(300).json({message: "Libro no encontrado"})
  }
});

module.exports.general = public_users;
