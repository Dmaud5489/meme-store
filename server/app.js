const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
var upload = multer({ storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Images only, please'));
        }
    } 
})

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.status(200).sendFile('index.html', {
        root: path.resolve('../public'),
        img : path.resolve('../server/uploads')
    });
});

app.get('/admin', (req, res)  => {
    res.status(200).sendFile('admin.html', {
        root: path.resolve('../public')
    });
})

app.post('/profile', upload.single('avatar'), function (req, res, next) {
    var sql = "SELECT COUNT(*) AS total FROM memes";
    var query = con.query(sql, function(err, result) {
        insertMeme(result[0].total+1, req.file.filename);
    })
})

app.get('/returnMemeFromDatabase', (request, response) => {
    var index;
    var sql = "SELECT COUNT(*) AS total FROM memes";
    var query = con.query(sql, function(err, result) {
        index = result[0].total;
        if (index > 0) {
            var n = Math.floor(Math.random()*Math.floor(index)+1);
            var sql = "SELECT url FROM memes WHERE id = " + n;
            var query = con.query(sql, function(err, result) {
                var res = result[0]["url"];
                response.status(200).sendFile(__dirname + "/uploads/" + res);
            })
        } else {
            console.log("Table is empty.");
            response.status(200).send();
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


/** DAO stuff: */
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "sqluserpw", //Q1!
  database: "yelp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var createTable = "CREATE TABLE IF NOT EXISTS memes (id INT, url VARCHAR(256), categoryId INT);";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

function insertMeme(id, url) {
    var query = con.query("INSERT INTO memes VALUES (" + id + ", '" + url + "', 1);",
    function (err, result) {
        if (err) throw err;
        console.log("1 meme inserted");
    });
};