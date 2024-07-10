const http = require('http');
const express = require('express');
const ejs = require('ejs');

const bodyParser = require("body-parser");
const { readFile } = require('fs');

const app = express();
const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 3002;

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('search_result');
});

app.get('/search_result', (req, res) => {
  res.render('search_result');
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});