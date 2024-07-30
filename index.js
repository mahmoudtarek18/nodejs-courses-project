const express = require("express");
const { ERROR } = require("./utils/httpStatusText");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

const cors = require("cors");

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

mongoose.connect(url, {
  dbName,
});

const PORT = process.env.PORT || 8000;

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

// global middleware for not found routes
app.all("*", (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: "this resource is not available " });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
/*
const fileContent = fs.readFileSync("./users.json");
console.log("fileContent", fileContent.toString());

=======================================

fs.writeFile(
  "./users.json",
  JSON.stringify([{ id: 1, name: "jon" }]),
  "utf-8",
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

=======================================

const rStream = fs.createReadStream("./test.txt", "utf-8");
const wStream = fs.createWriteStream("./stream.txt", "utf-8");

rStream.on("close", () => {
  console.log("🧧 closed");
});

rStream.on("open", () => {
  console.log("🔺 open");
});
rStream.on("data", (chunk) => {
  console.log("🟩 chunk", chunk);
  wStream.write("\n 🟩 chunk \n");
  wStream.write(chunk);
});

=======================================

const start = performance.now();
pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 1", performance.now() - start);
});

pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 2", performance.now() - start);
});

pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 3", performance.now() - start);
});

pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 4", performance.now() - start);
});

pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 5", performance.now() - start);
});

pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 5", performance.now() - start);
});
pbkdf2("secret", "salt", 100000, 64, "sha512", () => {
  console.log("end of secret 5", performance.now() - start);
});

*/
