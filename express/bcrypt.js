import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import userModel from './model/usermodel.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __dirname = path.resolve()

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'register.html'))
})

app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await userModel.create(
        {
            username,
            password: hash,
        }
    )

    res.redirect("/log");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne(
        {
            username,
        }
    )

    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            res.send("welcome buddy..")
        } else {
            res.send("invalid credentials")
        }

    } else {
        res.send("user not found")
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

