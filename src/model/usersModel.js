const Pool = require("../config/db");

//GET ALL USERS
const selectAllUsers = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM users ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectUsers = (id) => {
  return Pool.query(`SELECT * FROM users WHERE id = '${id}'`);
};

//DELETE SELECT USERS
const deleteUsers = (id) => {
  return Pool.query(`DELETE FROM users WHERE id = '${id}'`);
};

//POST USERS
const createUsers = (data) => {
  const { id, email, passwordHash, confirmpasswordHash, name, phone, photo } =
    data;
  return Pool.query(`INSERT INTO users(id, email, password, confirmpassword, name, phone, photo) 
    VALUES ('${id}','${email}','${passwordHash}','${confirmpasswordHash}','${name}',
    '${phone}','${photo}')`);
};

//PUT SELECT USERS
const updateUsers = (data) => {
  const { id, photo, name } = data;
  return Pool.query(
    `UPDATE users SET photo = '${photo}', name = '${name}' WHERE id = '${id}'`
  );
};

const updatePasswordUsers = (data) => {
  const { id, password, confirmpassword } = data;
  return Pool.query(
    `UPDATE users SET password = '${password}', confirmpassword = '${confirmpassword}'WHERE id = '${id}'`
  );
};

//FIND EMAIL
const findUUID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE id= '${id}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM users WHERE email= '${email}' `,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM users`);
};

module.exports = {
  selectAllUsers,
  selectUsers,
  deleteUsers,
  createUsers,
  updateUsers,
  updatePasswordUsers,
  findUUID,
  findEmail,
  countData,
};
