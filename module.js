// const http = require(http);// built-in module

// const express = require('express'); // third-party module

// const mymodule = require('./module'); // local module or custom module



// const http = require('http'); // built-in module

// function requestListener(req, res) {
//     console.log(req.url);
// }
// http.createServer(requestListener) // function as a parameter or reference


// const http = require('http'); // built-in module

// const server = http.createServer((req, res) => { // anonymous function
//     console.log(req);
// });
// server.listen(3000);

//or

// const port = 3000
// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// const http = require('http')

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' })
//     res.write('<h1>Hello World</h1>')
//     res.write('<button>sumbit</button>')
//     res.end()
// })
// const port = 3000
// server.listen(port, () => {
//     console.log('server is running at port 3000')
// })


// import http from 'http'

// const server = http.createServer((req, res) => {

//     res.setHeader('Content-Type', 'text/html');
//     res.write('<h1>Hello World</h1>');
// res.end()
// })

// const port = 3000
// server.listen(port, () => {
//     console.log(`server is running at http://localhost:3000`)
// })

// const fnc = () => {
//     const name1 = "Aakash Jung Rayamajhi"
//     const name2 = "Nirmal Jung Rayamajhi"
//     console.log('hello i am', name1)
//     return console.log('end of game')
//     console.log(`hello i am ${name2}`)
// }

// fnc()


import http from 'http';
import url from 'url';
import fs from 'fs';

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');

    // ---------------- HOME PAGE (FORM) ----------------
    if (req.url === '/') {
        res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Stylish Form</title>

<style>
    body {
        margin: 0;
        font-family: "Poppins", sans-serif;
        background: linear-gradient(135deg, #4b79a1, #283e51);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .form-container {
        background: white;
        padding: 35px;
        border-radius: 15px;
        width: 350px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }
    h2 { text-align: center; }
    input {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border-radius: 8px;
        border: 2px solid #ccc;
    }
    button {
        width: 100%;
        padding: 12px;
        background: #4b79a1;
        border: none;
        color: white;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
    }
    button:hover { background:#35516a; }
</style>
</head>

<body>
<div class="form-container">
    <h2>Register</h2>

    <!-- FORM -->
    <form action="/details" method="GET">
        <input type="text" name="name" placeholder="Enter your name" required>
        <input type="email" name="email" placeholder="Enter your email" required>
        <input type="password" name="password" placeholder="Enter password" required>
        <button type="submit">Submit</button>
    </form>
</div>

</body>
</html>
        `);
        return res.end();

        // ---------------- DETAILS PAGE ----------------
    }
    else if (req.url.startsWith('/details')) {


        // const parsedUrl = url.parse(req.url, true);
        // const name = parsedUrl.query.name;
        // const email = parsedUrl.query.email;
        // const password = parsedUrl.query.password;

        const { name, email, password } = url.parse(req.url, true).query;
        console.log(name, email, password);

        const data = ` ${name} , ${email} ,  ${password}`;
        fs.appendFileSync('info.txt', data)

        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }


});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
