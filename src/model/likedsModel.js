const Pool = require("../config/db");

// GET ALL Coments
const selectAllLikeds = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM likeds ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT RICAPES BY users and recipes id
const selectLikeds = (users_id) => {
  return Pool.query(`
    SELECT likeds.id AS liked_id, likeds.*, recipes.*
    FROM likeds
    LEFT JOIN recipes ON likeds.recipes_id = recipes.id
    WHERE likeds.users_id = '${users_id}'
  `);
};


// INSERT Coments
const insertLikeds = (data) => {
  const { id, recipes_id, users_id } = data;
  return Pool.query(
    `INSERT INTO likeds (id, recipes_id, users_id) 
    VALUES('${id}', '${recipes_id}', '${users_id}' )`
  );
};

// DELETE Coments
const deleteLikeds = (id) => {
  return Pool.query(`DELETE FROM likeds WHERE id='${id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM likeds");
};

//
const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT likeds FROM Likeds WHERE id='${id}'`,
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

const findLikedsRecipesId = (recipes_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM likeds WHERE recipes_id='${recipes_id}'`,
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

const findLikedsUsersId = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM likeds WHERE users_id='${users_id}'`,
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

module.exports = {
  selectAllLikeds,
  selectLikeds,
  insertLikeds,
  deleteLikeds,
  findLikedsRecipesId,
  findLikedsUsersId,
  countData,
  findID,
};
