const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Regex to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Please enter a valid email address",
    },
  },
  phone: {
    type: String,
    // required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regex to ensure phone number has 10 digits
        return /^[0-9]{10}$/.test(value);
      },
      message: "Phone number must be 10 digits",
    },
  },
  password: {
    type: String,
    // required: true,
    minlength: 8,
  },
  gender: {
    type: String,
    // required: true,
    enum: ["Male", "Female"], // Only allow Male or Female as values
  },
  age: {
    type: Number,
    // required: true,
    min: 18, // Assuming minimum age of 18 for employees
    max: 65, // Assuming maximum age of 65
  },
});

// Create the employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
