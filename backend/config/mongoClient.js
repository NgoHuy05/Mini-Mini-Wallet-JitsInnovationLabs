const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/?replicaSet=rs0';

const client = new MongoClient(uri);

let db;

async function connect() {
  await client.connect();
  db = client.db('mini-mini-wallet');

  console.log('✅ MongoClient connected (transaction ready)');
}

module.exports = {
  client,
  getDb: () => db,
  connect
};