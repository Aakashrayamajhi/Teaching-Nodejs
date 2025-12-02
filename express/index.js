import express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.send('home page')
})
app.get('/about', (req, res) => {
    res.send('about page')
})


const port = 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})