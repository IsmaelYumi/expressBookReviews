const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{}

const authenticatedUser = (username,password)=>{
  const user = users.find(u => u.username === username && u.password === password);
  return user != null;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username= req.body.username;
  let password=req.body.password;
  if(authenticatedUser(username,password)){
    const token=jwt.sign({username:username},"fingerprint_customer",{expiresIn:'1h'})
    return res.status(200).json({message:"Login exitoso",token: token})
  }else{
    return res.status(401).json({message: "Usuario no valido",users:users});
  }
  
  //Write your code here
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let user= req.user;
  let review =req.body.review;
  let isbn=req.params.isbn
  let libro;
 if(isbn!=null){
  libro=books[isbn]
   }else{
    res.status(401).json({message:"ISBN no dado"})
   }
   if(libro!=null){
    libro.reviews[user.username]=review
    res.status(200).json({message:"Review publicada"})
   }else{
    res.status(401).json({message:"ISBN no validop"})
   }
});
regd_users.delete("/auth/review/:isbn",(req,res)=>{
  let user= req.user;
  let isbn=req.params.isbn
  if(isbn!=null){
    libro=books[isbn]
     }else{
      res.status(401).json({message:"ISBN no dado"})
     }
     if(libro!=null){
     delete libro.review.user.username
      res.status(200).json({message:"Review borrada"})
     }else{
      res.status(401).json({message:"ISBN no validop"})
     }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
