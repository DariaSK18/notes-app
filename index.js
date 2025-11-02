// console.log('hello')
// const os = require('os')
// let res = os.platform()
// console.log(res);
// const https = require('https')
// const fs = require('fs')

// const server = https.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
//     const stream = fs.createReadStream('index.ejs')
//     stream.pipe(res)
//     // res.end()
// })

// server.listen(PORT, HOST, () => {
//     console.log(`Server is running: https://${HOST}:${PORT}`);
    
// })

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'})
})
app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
})
app.get('/register', (req, res) => {
    res.render('register', {title: 'Register'})
})

app.post('/register', (req, res) => {
    const test = req.body.test
    console.log(req.body, req.body.test)
    if(test === '') return res.redirect('login')
    else return res.redirect('/')
})

const PORT = 3000
const HOST = 'localhost'

app.listen(PORT, () => {
    console.log(`Server is running: http://${HOST}:${PORT}`);
})