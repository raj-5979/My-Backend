const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

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

//FETCH-DATA(GET)
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

//INSERT-DATA (POST)
app.post("/add-book", async (req, res) => {
  // Insert data into your database
  const result =
    await sql.query`INSERT INTO Bookstore (BookID, BookName, Author, price) VALUES (${req.body.BookID}, ${req.body.BookName}, ${req.body.Author}, ${req.body.price})`;

  // Send a response back to the client
  res.status(200).json({ message: "Data inserted successfully", result });
});

//EDIT/UPDATE-DATA (PUT)

app.put("/edit-Book/:BookID", async (req, res) => {
  try {
    // Update data in your database
    const result = await sql.query`
      UPDATE Bookstore
      SET BookName = ${req.body.BookName},
          Author = ${req.body.Author},
          price = ${req.body.price}
      WHERE BookID = ${req.params.BookID}`;

    // Check if the update was successful
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Data updated successfully", result });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "An error occurred", error });
  }
});

//DELETE-DATA(DELETE)

app.delete("/delete-book/:BookID", async(req,res)=>{
  try{
    const result = await sql.query`DELETE FROM Bookstore WHERE BookID = ${req.params.BookID}`;
    res.status(200).json({ message: "Data deleted successfully", result });
  }
  catch(error){
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
