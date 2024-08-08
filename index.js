const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();

//Middleware
app.use(bodyParser.json());

//SQL Server configuration
var dbConfig = {
  user: "test",
  password: "sqladmin",
  server: "KDC1-L-W075XL0",
  database: "book",
  options: {
    instanceName: "SQLEXPRESS",
    trustServerCertificate: true,
    encrypt: true,
  },
};

//Connect to the database and create an endpoint
sql.connect(dbConfig, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection Successful!");
  }
});

//Define route for fetching data from SQL Server
app.get("/", (request, response) => {
  // Execute a SELECT query
  new sql.Request().query("SELECT * FROM bookstore", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      response.send(result.recordset);
      console.dir(result.recordset);
    }
  });
});

app.post("/book", async (req, res) => {
  // Insert data into your database
  const result =
    await sql.query`INSERT INTO Bookstore (BookID, BookName, Author, price) VALUES (${req.body.BookID}, ${req.body.BookName}, ${req.body.Author}, ${req.body.price})`;

  // Send a response back to the client
  res.status(200).json({ message: "Data inserted successfully", result });
});



// Start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
