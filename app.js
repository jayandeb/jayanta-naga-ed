const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();


const PORT = process.env.PORT || 3000;

// SQLite3 Database
const db = new sqlite3.Database('./nagaEd.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
    // Create user table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        address TEXT
      )
    `);
  }
});


app.set('view engine', 'ejs')//set view engine to ejs



//! Middleware
app.use(bodyParser.json());

//? Routes

app.get('/', (req, res) => {
    res.render('welcome')

})

app.get('/register', (req, res) => {
  res.render('register')
})


//TO REGISTER
app.post('/register', (req, res) => {



  const { username, password, address } = req.body;

  //! Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to hash password' });
    }

    //! Insert user into database
    db.run('INSERT INTO users (username, password, address) VALUES (?, ?, ?)', [username, hashedPassword, address], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });

   
   
  });
});



//! TO CHECK REGISTERED USERS
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).send('Error fetching users');
    } else {
      res.json(rows);
    }
  });
});






//! Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
