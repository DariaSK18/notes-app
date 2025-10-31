// console.log('hello')
// const os = require('os')
// let res = os.platform()
// console.log(res);

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    render('index')
})
app.get('/login', (req, res) => {
    render('login')
})
app.get('/register', (req, res) => {
    render('register')
})