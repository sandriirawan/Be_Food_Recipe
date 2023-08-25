const Pool = require("../config/db");

// GET ALL Coments
const selectAllComments = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM comments ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT Coments BY recipes_id
const selectComments = (recipes_id) => {
  return Pool.query(`
  SELECT comments.*, users.name, users.photo
    FROM comments 
    LEFT JOIN users ON comments.users_id = users.id
    WHERE comments.recipes_id = '${recipes_id}'
    `);
};

// INSERT Coments
const insertComments = (data) => {
  const { id, recipes_id, users_id, comment } = data;
  return Pool.query(
    `INSERT INTO comments (id, recipes_id, users_id, comment) 
    VALUES('${id}', '${recipes_id}', '${users_id}', '${comment}' )`
  );
};

// UPDATE Coments
const updateComments = (data) => {
  const { id, recipes_id, users_id, comment } = data;
  return Pool.query(
    `UPDATE comments SET recipes_id='${recipes_id}', users_id='${users_id}', comment='${comment}' WHERE 'id=${id}'`
  );
};

// DELETE Coments
const deleteComments = (id) => {
  return Pool.query(`DELETE FROM comments WHERE id='${id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM comments");
};

//
const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT comments FROM comments WHERE id='${id}'`,
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
  selectAllComments,
  selectComments,
  insertComments,
  updateComments,
  deleteComments,
  countData,
  findID,
};
