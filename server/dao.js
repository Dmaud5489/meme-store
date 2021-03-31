var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "sqluserpwQ1!",
  database: "yelp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  /*var createTable = "CREATE TABLE IF NOT EXISTS rating (ratee VARCHAR(256), stars TINYINT, comment VARCHAR(1024));";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });*/

  var createTable = "CREATE TABLE IF NOT EXISTS memes (id INT, url VARCHAR(256), categoryId INT);";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = {
  deleteRating: function (ratee, stars, comment) {
    con.query("DELETE FROM rating WHERE ratee=" + con.escape(ratee) + " AND stars=" + con.escape(stars) + "AND comment=" + con.escape(comment),
    function (err, result) {
      if (err) throw err;
      console.log("Deleted: " + result);
    });
  },

    getAllRatings: function() {
      con.query("SELECT ratee, stars, comment FROM rating;",
      function (err, result, fields) {
        if (err) throw err;

        for (var n = 0; n < result.length; n++) {
          console.log(result[n]);
        }
      });
    },

    insertRating: function (ratee, stars, comment) {
      var query = con.query("INSERT INTO rating VALUES (" + con.escape(ratee) + ", " + stars + ", " + con.escape(comment) + ");",
      function (err, result) {
          if (err) throw err;
          console.log("Inserted: " + result);
      });
    },

    insertMeme: function(id, url) {
      var query = con.query("INSERT INTO memes VALUES (" + id + ", " + con.escape(url) + ", 1);",
      function (err, result) {
          if (err) throw err;
          console.log("1 meme inserted");
      });
  }
}

/*function insertRating(ratee, stars, comment) {
    var query = con.query("INSERT INTO rating VALUES (" + con.escape(ratee) + ", " + stars + ", " + con.escape(comment) + ");",
    function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
};*/