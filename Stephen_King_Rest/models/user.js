const db = require('../db');
const bcrypt = require('bcrypt');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
                    password,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1
            `,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      //compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError('Invalid username/password');
  }

  static async register({ username, password, isAdmin }) {
    const check = await db.query(
      `SELECT username
            FROM users
            WHERE username =$1`,
      [username]
    );

    if (check.rows[0]) {
      throw new BadRequestError(`Check Failed`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (username, password, is_admin)
         VALUES ($1, $2, $3)
         RETURNING username`,
      [username, hashedPassword, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
