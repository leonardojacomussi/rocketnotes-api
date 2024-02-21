const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  /**
   * index - GET para listar vários registros
   * show - GET para listar um registro específico
   * create - POST para criar um novo registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
   */

  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Email address already used.");
    };

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json({ message: "User created." });
  };

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get(
      "SELECT * FROM users WHERE id = (?)",
      [user_id]
    );

    if (!user) {
      throw new AppError("User not found.", 404);
    };

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email address already used.");
    };

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldPassword) {
      throw new AppError("Old password is required.");
    };

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match.");
      };

      user.password = await hash(password, 8);
    };

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.status(200).json({ message: "User updated." });
  };
};

module.exports = UsersController;