const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "baiatul1",
  database: "hotel-management",
});

module.exports = client;
