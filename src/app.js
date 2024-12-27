const express = require("express");
const path = require("path");
const Employee = require("./models/register");
require("./db/conn");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 2100; //?process.env.PORT is an environment variable often set by hosting providers (like Heroku, AWS, or Azure) to specify which port your server should use.

// ==================================================//
//! Middleware
app.use(express.static(path.join(__dirname, "../public"))); //?By using this client can access any file in the public folder

//? app.use(express.json()) Middleware:
//* 1. Parses incoming JSON payloads in the request body.
//* 2. Makes parsed data available in req.body.
//* 3. Required for handling requests with 'Content-Type: application/json'.
//* 4. Commonly used for APIs or modern web forms submitting JSON data.
//* 5. Without this, req.body will be undefined for JSON payloads.
app.use(express.json());

//? app.use(express.urlencoded({ extended: true })) Middleware:
//* 1. Parses incoming request bodies with URL-encoded data (form submissions).
//* 2. Makes parsed data available in req.body.
//* 3. Required for handling requests with 'Content-Type: application/x-www-form-urlencoded'.
//* 4. The { extended: true } option allows parsing nested objects in the data.
//* 5. Without this, req.body will be undefined for URL-encoded form submissions(see the JsonVsURLencoded.png if not understanding).
app.use(express.urlencoded({ extended: true })); // For parsing form data

// ==========================================================//
//? Set view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));

// ==========================================================//
// ?Define the Routes
// *What do you want to show on the root page
app.get("/", (req, res) => {
  res.render("index");
});

//* Route for other pages
app.get("/employeeData", (req, res) => {
  res.render("employeeData");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/user", (req, res) => {
  res.render("user");
});

// ==========================================================//
//? API Route: /api/employeeData
//todo: Purpose:
//* - Serves as an API endpoint to fetch employee data in JSON format.
//* - Provides raw data for frontend scripts or external tools (not for rendering HTML).
//*
//todo: How It Works:
//* 1. Fetches all employee records from MongoDB using `Employee.find()`.
//* 2. Sends the data as a JSON response using `res.json(employees)`.
//* 3. If an error occurs, it logs the error and sends a 500 status with an error message.
app.get("/api/employeeData", async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch employees from MongoDB
    res.json(employees); // Send the employee data as JSON
  } catch (error) {
    console.error("Error retrieving employees:", error.message);
    res.status(500).send("Error retrieving employees");
  }
});

// ?For getting userName on the user page
app.get("/api/user", async (req, res) => {
  try {
    const employee = await Employee.findOne({ email });
    const fullName = `${employee.firstName} ${employee.lastName}`;
    res.json(fullName);
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    res.status(500).send("Error retrieving user");
  }
});
// ===============================================================//

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cnfPassword = req.body.confirmPassword;

    if (password === cnfPassword) {
      //? Create a new Employee instance using the data from the request body
      const newEmployee = new Employee(req.body);

      //? Save the new employee to the MongoDB database
      //? The save() method is provided by Mongoose to store data in the collection
      await newEmployee.save();
      res.status(201).send("Employee registered successfully!");
    } else {
      res.status(400).send("Passwords do not match");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// ===================================================================//

app.post("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Find the employee by email
    const employee = await Employee.findOne({ email });
    console.log(employee);
    if (!employee) {
      return res.status(400).send("Invalid login credentials");
    }

    // Check if the entered password matches the stored password
    if (employee.password !== password) {
      return res.status(400).send("Invalid login credentials");
    }

    // If login is successful, pass the full name (firstName and lastName) to the user page
    const fullName = `${employee.firstName} ${employee.lastName}`;
    res.render("user", { name: fullName });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
});

// ====================================================================//
// Delete employee route
app.delete("/api/deleteEmployee/:id", async (req, res) => {
  const employeeId = req.params.id;
  console.log(req.params);
  try {
    // Find employee by ID and remove from the database
    await Employee.findByIdAndDelete(employeeId);
    res.status(200).send("Employee deleted successfully");
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).send("Error deleting employee");
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
