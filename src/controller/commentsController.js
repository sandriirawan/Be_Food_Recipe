const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");

const {
  selectAllComments,
  selectComments,
  insertComments,
  updateComments,
  deleteComments,
  countData,
  findID,
} = require("../model/commentsModel");

const commentsController = {
  getAllComments: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllComments({ limit, offset, sort, sortby });
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
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  getSelectComments: async (req, res) => {
    const recipes_id = String(req.params.id);

    selectComments(recipes_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertcomments: async (req, res) => {
    const { recipes_id, users_id, comment } = req.body;
    const {
      rows: [count],
    } = await countData();
    const id = uuidv4();
    const data = {
      id,
      recipes_id,
      users_id,
      comment,
    };
    insertComments(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Comment Success")
      )
      .catch((err) => res.send(err));
  },

  updateComments: async (req, res) => {
    try {
      const { recipes_id, users_id, comment } = req.body;
      const id = String(req.params.id);
      const { rowCount } = await findID(id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        id,
        recipes_id,
        users_id,
        comment,
      };
      updateComments(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteComments: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findID(id);
  
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      } else {
        const result = await deleteComments(id);
        commonHelper.response(res, result.rows, 200, "Delete bookmark Success");
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = commentsController;
