require("dotenv").config();
const cassandra = require("cassandra-driver");

//Connect to Cassandra database
const client = new cassandra.Client({
  contactPoints: [process.env.CASS_CONTACT],
  localDataCenter: "datacenter1",
  protocolOptions: { port: proceess.env.CASS_PORT },
  keyspace: "headphones",
});

module.exports = client;
