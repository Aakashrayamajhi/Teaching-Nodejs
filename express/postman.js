const express = require('express')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/home', (req, res) => {
    res.json({ message: 'welcome to home page' })
})
app.post('/login', (req, res) => {
    const { username, password, age } = req.body
    const data = `username: ${username}  password: ${password} age: ${age}`
    res.send(data)
})
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})

