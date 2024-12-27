const express = require("express");
const path = require("path");
const Employee = require("./models/register");
require("./db/conn");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 2100;

// Middleware
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Set view engine
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

// Route for rendering employeeData.hbs
app.get("/employeeData", (req, res) => {
  res.render("employeeData");
});

// New API route for fetching employee data
app.get("/api/employeeData", async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch employees from MongoDB
    res.json(employees); // Send the employee data as JSON
  } catch (error) {
    console.error("Error retrieving employees:", error.message);
    res.status(500).send("Error retrieving employees");
  }
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cnfPassword = req.body.confirmPassword;

    if (password === cnfPassword) {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      res.status(201).send("Employee registered successfully!");
    } else {
      res.status(400).send("Passwords do not match");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete employee route
app.delete("/api/deleteEmployee/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    // Find employee by ID and remove from the database
    await Employee.findByIdAndDelete(employeeId);
    res.status(200).send("Employee deleted successfully");
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).send("Error deleting employee");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/user", (req, res) => {
  res.render("user");
});
app.post("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Find the employee by email
    const employee = await Employee.findOne({ email });

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

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
