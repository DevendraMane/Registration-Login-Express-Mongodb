const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://localhost:27017/Complete_Web_Project_DB`, {})
  .then(() => {
    console.log("DB Connection✅");
  })
  .catch((err) => {
    console.log(err);
  });

// !try stopping the DB service through Terminal
// net stop MongoDB
// net start MongoDB
