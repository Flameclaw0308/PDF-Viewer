const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path=require('path');
const fs=require('fs');
const encoder=bodyParser.urlencoded();
const app = express();
const session=require('express-session');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*app.use(`public/css/dashboard.css`, function(req, res, next) {
  res.type('text/css');
  next();
});*/

// Create a MySQL connection

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4321',
  database: 'clients'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  }));
// Handle the login request
app.get("/",function(req,res){
  res.sendFile(__dirname+"/login.html");
});
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Perform the database query to validate the credentials
 app.post("/",encoder,(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;
  const query = `SELECT * FROM credentials WHERE user_id = ? AND password = ?`;

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error performing query:", err);
      res.status(500).send('An error occurred');
      return;
    }
    if (results.length > 0) {
     const access=results[0].access_level;
     req.session.user={
      role: access
     };
      res.redirect('/dashboard');
  }
    else {
      res.send('failure'); // Invalid credentials
    }
  });
});
app.get("/dashboard", (req, res) => {
    const isAdminUser = () => {
      const userRole = req.session.user ? req.session.user.role : "";
      return userRole === "admin";
    };
  
    res.render("dashboard", { isAdminUser });
  });
  

const port = 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
