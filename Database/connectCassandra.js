require("dotenv").config();
const cassandra = require("cassandra-driver");

//Connect to Cassandra database
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  protocolOptions: { port: 9042 },
  keyspace: "headphones",
});

module.exports = client;
