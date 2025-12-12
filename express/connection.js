const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

// Middleware to enable req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'about.html'))
});

app.get('/login', (req, res) => {

    const { username, password } = req.query
    const data = `username: ${username}  password: ${password}`
    fs.appendFileSync('login.txt', data)
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'contact.html'))
})

app.post('/submit', (req, res) => {
    const { firstname, lastname, email, subject, message } = req.body;

    const data = `First Name: ${firstname} , Last Name: ${lastname} , Email: ${email} , Subject: ${subject} , Message: ${message}\n`;

    fs.appendFileSync('contact.txt', data);

    res.redirect('/contact');
});



const port = 3001
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})