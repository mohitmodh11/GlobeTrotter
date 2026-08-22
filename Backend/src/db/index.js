import Database from "better-sqlite3";

const db = new Database("src/db/database.sqlite");

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    cost_index REAL DEFAULT 0,
    popularity REAL DEFAULT 0,
    image TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    cover_photo TEXT,
    is_public INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trip_stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    stop_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id)
      REFERENCES trips(id)
      ON DELETE CASCADE,

    FOREIGN KEY (city_id)
      REFERENCES cities(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_id INTEGER,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    cost REAL DEFAULT 0,
    duration REAL DEFAULT 0,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (city_id)
      REFERENCES cities(id)
      ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS stop_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stop_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    activity_date TEXT,
    start_time TEXT,
    end_time TEXT,
    custom_cost REAL,
    activity_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (stop_id)
      REFERENCES trip_stops(id)
      ON DELETE CASCADE,

    FOREIGN KEY (activity_id)
      REFERENCES activities(id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    stop_id INTEGER,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    expense_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id)
      REFERENCES trips(id)
      ON DELETE CASCADE,

    FOREIGN KEY (stop_id)
      REFERENCES trip_stops(id)
      ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL UNIQUE,
    share_id TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id)
      REFERENCES trips(id)
      ON DELETE CASCADE
  );
`);

console.log("SQLite database initialized successfully");

export default db;