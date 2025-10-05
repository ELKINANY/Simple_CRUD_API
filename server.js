const express = require("express");
const app = express();
require("dotenv").config();
const DB = require("./config/DB");
const errorMiddleware = require("./middlewares/error.middleware");
const apiError = require("./utils/apiError");
const cors = require('cors');

DB();

app.use(express.json());

app.use(cors('*'));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));

app.use((req, res, next) => {
  next(new apiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}

module.exports = app;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
