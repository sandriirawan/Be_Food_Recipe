const Pool = require("../config/db");

// GET ALL RECIPES
const selectAllRecipes = ({ search, limit, offset, sort, sortby }) => {
  return Pool.query(`
  SELECT *
  FROM recipes WHERE title ILIKE '%${search}%'
  ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

// SELECT RICAPES BY ID
const selectRecipesById = (id) => {
  return Pool.query(`
  SELECT recipes.*, users.name
  FROM recipes
  LEFT JOIN users ON recipes.users_id = users.id
  WHERE recipes.id='${id}'`);
};

// SELECT RICAPES BY USERS ID
const selectRecipesByUserId = (users_id) => {
  return Pool.query(`
  SELECT *
  FROM recipes
  WHERE recipes.users_id='${users_id}'`);
};

// INSERT RECIPES
const insertRecipes = (data) => {
  const {
    id,
    title,
    ingredients,
    photo,
    title_video,
    video,
    video2,
    video3,
    users_id,
  } = data;
  return Pool.query(
    `INSERT INTO recipes (id, title, ingredients, photo, title_video, video, video2, video3, users_id) VALUES('${id}', '${title}', '${ingredients}', '${photo}','${title_video}', '${video}','${video2}','${video3}','${users_id}')`
  );
};

// UPDATE RECIPES
const updateRecipes = (data) => {
  const { id, title, ingredients, photo, title_video, video, video2, video3 } =
    data;
  return Pool.query(
    `UPDATE recipes SET title='${title}', ingredients='${ingredients}' ,photo='${photo}',title_video='${title_video}',video='${video}' ,video2='${video2}',video3='${video3}'WHERE id='${id}'`
  );
};

// DELETE RECIPES
const deleteRecipes = (id) => {
  return Pool.query(`DELETE FROM recipes WHERE id='${id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM recipes");
};

// FIND UUID
const findUUID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipes FROM recipes WHERE id='${id}'`,
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

// FIND UUID
const findUsersId = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipes FROM recipes WHERE users_id='${users_id}'`,
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
  selectAllRecipes,
  selectRecipesById,
  selectRecipesByUserId,
  insertRecipes,
  updateRecipes,
  deleteRecipes,
  countData,
  findUUID,
  findUsersId,
};
