import db from "../db/index.js";

export const createUser = (name, email, password, role = "user") => {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(name, email, password, role);

  return getUserById(result.lastInsertRowid);
};

export const getUserById = (id) => {
  return db
    .prepare(`
      SELECT id, name, email, role, profile_image, created_at, updated_at
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
      SELECT id, name, email, role, profile_image, created_at
      FROM users
      ORDER BY created_at DESC
    `)
    .all();
};

export const updateUser = (id, name, email, profileImage = null) => {
  db.prepare(`
    UPDATE users
    SET name = ?,
        email = ?,
        profile_image = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, email, profileImage, id);

  return getUserById(id);
};

export const deleteUser = (id) => {
  return db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `).run(id);
};