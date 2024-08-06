const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const sql = require('mssql');

const app = express();
// const port = 3000;

// Middleware
// app.use(bodyParser.json());
// app.use(cors());

// SQL Server configuration
var dbConfig = {
  user: 'test',
  password: 'sqladmin',
  server: 'KDC1-L-W075XL0',
  database: 'book',
  options: {
    instanceName: 'SQLEXPRESS',
    trustServerCertificate: true,
    encrypt: true,
  }
};

// Connect to the database and create an endpoint
sql.connect(dbConfig, err => {
  if (err){
    console.log (err);
  }else{
    console.log("Connection Successful!");

  }
  
});

// Define route for fetching data from SQL Server
app.get("/", (request, response) => {
  // Execute a SELECT query
  new sql.Request().query("SELECT * FROM bookstore", (err, result) => {
      if (err) {
          console.error("Error executing query:", err);
      } else {
          response.send(result.recordset); // Send query result as response
          console.dir(result.recordset);
      }
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

//   app.get('/api/data', (req, res) => {
//     const request = new sql.Request();
//     request.query('SELECT * FROM bookstore', (err, result) => {
//       if (err){
//         console.error('Query failed:', err);
//         res.status(500).send('Server error');
//         return;
//       } 
//       res.send(result.recordset);
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
