/**
 * Shared MongoDB connection for runnable examples.
 * Article: "How to Design Nested Documents for a Blogging App in MongoDB"
 *
 * Usage:
 *   const { getDb, close } = require('./lib/db');
 *   const db = await getDb();
 *   // ... use db ...
 *   await close();
 */

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'blogging_app_examples';

let client = null;

/**
 * @returns {Promise<import('mongodb').Db>}
 */
async function getDb() {
  if (!client) {
    client = new MongoClient(uri, { appName: 'devrel-tutorial-javascript-express' });
    await client.connect();
  }
  return client.db(dbName);
}

/**
 * Close the connection. Call at end of script so process exits.
 */
async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { getDb, close };
