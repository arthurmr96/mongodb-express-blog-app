/**
 * MongoDB connection for the Express app. Uses the same DB as examples (final schema).
 */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'blogging_app_examples';

let client = null;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { getDb, close };
