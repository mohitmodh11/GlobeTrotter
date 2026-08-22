import db from "../db/index.js";

export const createUser = (
  name,
  username,
  email,
  password,
  profileImage = null,
  role = "user"
) => {
  const stmt = db.prepare(`
    INSERT INTO users (
      name,
      username,
      email,
      password,
      profile_image,
      role
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    username,
    email,
    password,
    profileImage,
    role
  );

  return getUserById(result.lastInsertRowid);
};

export const getUserById = (id) => {
  return db
    .prepare(`
      SELECT id, name,username,email, role,language, profile_image, created_at, updated_at
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
      SELECT id, name,username, email, role, profile_image, created_at
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

export const getUserByUsername = (username) => {
  return db
    .prepare(`
      SELECT *
      FROM users
      WHERE username = ?
    `)
    .get(username);
};

export const updateUserPassword = (id, hashedPassword) => {
  db.prepare(`
    UPDATE users
    SET password = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(hashedPassword, id);

  return getUserById(id);
};

export const updateUserLanguage = (id, language) => {
  db.prepare(`
    UPDATE users
    SET language = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(language, id);

  return getUserById(id);
};