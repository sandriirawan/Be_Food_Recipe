const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const {
  selectAllLikeds,
  selectLikeds,
  insertLikeds,
  deleteLikeds,
  findLikedsRecipesId,
  findLikedsUsersId,
  countData,
  findID,
} = require("../model/likedsModel");
const { string } = require("joi");

const likedsController = {
  getAllLikeds: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllLikeds({ limit, offset, sort, sortby });
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

  getSelectLikeds: async (req, res) => {
    const users_id = String(req.params.users_id);
    selectLikeds(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertLikeds: async (req, res) => {
    const { recipes_id, users_id } = req.body;
    const { rowCount: RecipeLiked } = await findLikedsRecipesId(recipes_id);
    const { rowCount: UsersLiked } = await findLikedsUsersId(users_id);
    if (RecipeLiked && UsersLiked) {
      return res.json({ message: "Like Already" });
    }
    const id = uuidv4();
    const data = {
      id,
      recipes_id,
      users_id,
    };
    insertLikeds(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Like Success")
      )
      .catch((err) => res.send(err));
  },


  deleteLikeds: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findID(id);
  
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      } else {
        const result = await deleteLikeds(id);
        commonHelper.response(res, result.rows, 200, "Delete like Success");
      }
    } catch (error) {
      console.log(error);
    }
  },
  
};

module.exports = likedsController;
