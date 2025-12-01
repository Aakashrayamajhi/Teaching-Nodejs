import http from 'http'
import url from 'url'
import fs from 'fs'

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    if (req.url === '/') {
        res.write('<h1>Welqcome to Login page</h1>')
        res.write(`
            <form action="/details" method="get">
                <input type="text" name="username" placeholder="username">
                <input type="password" name="password" placeholder="password">
                <button type="submit">submit</button>
            </form>
            `)
        return res.end()
    } else if (req.url.startsWith('/details')) {
        const { username, password } = url.parse(req.url, true).query
        // console.log(username, password)

        const data = `username : ${username} , password : ${password}`

        fs.appendFileSync('info.text', data)

        res.end('Details saved successfully')
    } else {
        res.write('<h1>404 Not Found</h1>')
        res.end()
    }



})

const port = 3000;
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})