require("dotenv").config();
const express = require("express");
const app = express();
const DB = require("./config/DB");
const PORT = process.env.PORT;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
