import Database from "better-sqlite3";

const db = new Database("src/db/database.sqlite");

db.pragma("foreign_keys = ON");

export default db;