const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const {
  selectAllBookmarks,
  selectBookmarks,
  insertBookmarks,
  deleteBookmarks,
  findBookmarksRecipesId,
  findBookmarksUsersId,
  countData,
  findID,
} = require("../model/bookmarksModel");

const bookmarksController = {
  getAllBookmarks: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllBookmarks({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };

      commonHelper.response(
        res,
        result.rows,
        200,
        "get Data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  getSelectBookmarks: async (req, res) => {
    const users_id = String(req.params.users_id);
    selectBookmarks(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertBookmarks: async (req, res) => {
    let { recipes_id, users_id } = req.body;
    const { rowCount: RecipeBook } = await findBookmarksRecipesId(recipes_id);
    const { rowCount: UsersBook } = await findBookmarksUsersId(users_id);
    if (RecipeBook && UsersBook) {
      return res.json({ message: "Bookmarks Already" });
    }
    const {
      rows: [count],
    } = await countData();
    const id = uuidv4();

    const data = {
      id,
      recipes_id,
      users_id,
    };
    insertBookmarks(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Bookmark Success")
      )
      .catch((err) => res.send(err));
  },


  deleteBookmarks: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findID(id);
  
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      } else {
        const result = await deleteBookmarks(id);
        commonHelper.response(res, result.rows, 200, "Delete bookmark Success");
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = bookmarksController;
