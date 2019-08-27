const express = require("express"); // importing a CommonJS module

const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

function creepy(req, res, next) {
  const method = req.method;
  const url = req.url;
  console.log(`You made a request with ${method} to ${url}`);
  next();
}

function banana(req, res, next) {
  console.log("*** Banana ***");
  next();
}

function protected(req, res, next) {
  // read password from the requested headers
  // if password is melon let the request continue
  // otherwise stop the request and send back a 401 status code

  const { password } = req.headers;
  if (password && password.toLowerCase() === "mellon") {
    return next();
  }
  res.status(401).json({
    you: "Shall not pass"
  });
}

function query(req, res, next) {
  req.name = req.query.name;
  next();
}

function logQuery(req, res, next) {
  console.log(req.name);
  next();
}

server.use(express.json());

server.use(helmet());

server.use(banana);

// server.use(creepy);

server.use("/api/hubs", hubsRouter);

server.get("/secret", creepy, protected, (req, res) => {
  res.status(200).json({
    welcome: "secret agent"
  });
});

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/query", query, logQuery, (req, res) => {
  const name = req.name;
  res.send(`<h2> ${req.name} </h2>`);
});

module.exports = server;
