// const hello = require('./export');

// console.log(hello);

// console.log(__dirname);
// console.log(__filename);
// console.log(module)

// const path = require('node:path');

// console.log(path.basename('C:\\temp\\hi.html'));

// const os = require('node:os');

// console.log(os.freemem());
// console.log(os.arch());
// console.log(os.cpus());


// const { createHmac } = require('node:crypto');

// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//     .update('I love cupcakes')
//     .digest('hex');
// console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e


// const fs = require('fs');
// fs.writeFile('sky.txt', "Hello Sky", () => {
//     console.log("File created");
// })

// fs.appendFile("C:\\Users\\acer\\Desktop\\3rdsem\\sky.txt", "++++++", (err) => {
//     console.log(err);
// })



// fs.readFile("C:\\Users\\acer\\Desktop\\3rdsem\\sky.txt", "utf-8", (err, data) => {
//     if (err) {
//         console.log("Error:", err);
//     } else {
//         console.log(data);
//     }
// });


// import { add } from './export.js'

// import add from './export.js'

// console.log(add(5, 10));


// import http from 'http';
// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html')
//     if (req.url === '/') {
//         res.write(`
//     <html>
//         <head>
//             <title>My First Page</title>
//             <style>
//             body {
//                     background-color: lightgray;
//                     font-family: Arial, sans-serif;
//                     background-image: url('https://th.bing.com/th/id/R.a4a15fdda4e7eb6906ddbd3f850c0e69?rik=BTCIxijo4jzqng&pid=ImgRaw&r=0');
//                     background-size: cover;
//                     background-position: center;
//                 }
//                 h1 {
//                     color: blue;
//                 }
//                 input {
//                     width: 200px
//                 }
//                     button {
//                     background-color: green;
//                     color: white;
//                     padding: 10px 20px;
//                     border: none;
//                     cursor: pointer;
//     }
//             </style>
//         </head>
//         <body>
//             <h1>Hello from my Node.js Server!</h1>
//             <input type="text" placeholder="Enter something"/>
//             <button>Click Me!</button>
//         </body>
//     </html>

//     `)
//         res.end()
//     } else if (req.url === '/products') {
//         res.write('<h1>Welcome to Products Page</h1>');
//         res.end();
//     } else {

//         res.write('<h1>404 Not Found</h1>');
//         res.end();
//     }

// })

// const port = 3000;
// server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// })




import http from 'http';
import url from 'url';

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
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();       // <-- IMPORTANT
    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
