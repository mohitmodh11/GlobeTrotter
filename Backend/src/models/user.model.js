import db from "../db/index.js";

const generateUsername = (email) => {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  let username = base || "user";
  let counter = 1;

  while (
    db
      .prepare(
        `
          SELECT id
          FROM users
          WHERE username = ?
        `
      )
      .get(username)
  ) {
    username = `${base || "user"}${counter}`;
    counter++;
  }

  return username;
};

export const createUser = (
  name,
  email,
  password,
  role = "user"
) => {
  const username = generateUsername(email);

  const stmt = db.prepare(`
    INSERT INTO users (
      name,
      username,
      email,
      password,
      role,
      profile_image
    )
    VALUES (?, ?, ?, ?, ?, NULL)
  `);

  const result = stmt.run(
    name,
    username,
    email,
    password,
    role
  );

  return getUserById(result.lastInsertRowid);
};

export const getUserById = (id) => {
  return db
    .prepare(`
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
    `)
    .get(id);
};

export const getUserByEmail = (email) => {
  return db
    .prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `)
    .get(email);
};

export const getAllUsers = () => {
  return db
    .prepare(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)
    .all();
};

export const updateUser = (
  id,
  name,
  email
) => {
  db.prepare(`
    UPDATE users
    SET
      name = ?,
      email = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name,
    email,
    id
  );

  return getUserById(id);
};

export const deleteUser = (id) => {
  return db
    .prepare(`
      DELETE FROM users
      WHERE id = ?
    `)
    .run(id);
};

export const updateUserPassword = (
  id,
  password
) => {
  return db
    .prepare(`
      UPDATE users
      SET
        password = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .run(password, id);
};