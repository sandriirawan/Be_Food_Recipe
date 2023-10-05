const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
const Joi = require("joi");
const cloudinary = require("../middlewares/cloudinary");
const {
  selectAllRecipes,
  selectRecipesById,
  selectRecipesByUserId,
  insertRecipes,
  updateRecipes,
  deleteRecipes,
  countData,
  findUUID,
} = require("../model/recipesModel");

// const recipeSchema = Joi.object({
//   title: Joi.string().required(),
//   ingredients: Joi.string().required(),
//   title_video: Joi.string().required(),
//   users_id: Joi.string().required(),
//   video: Joi.string().pattern(new RegExp("https://youtu.be/")).required(),
// });

// const updateSchema = Joi.object({
//   title: Joi.string().required(),
//   ingredients: Joi.string().required(),
//   title_video: Joi.string().required(),
//   video: Joi.string().pattern(new RegExp("https://youtu.be/")).required(),
// });

const recipesController = {
  getAllRecipes: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "title";
      const sort = req.query.sort || "ASC";
      const search = req.query.search || "";
      const result = await selectAllRecipes({
        search,
        limit,
        offset,
        sort,
        sortby,
      });
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

  getRecipesById: (req, res, next) => {
    const id = String(req.params.id);
    selectRecipesById(id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },
  getRecipesByUserId: async (req, res, next) => {
    try {
      const users_id = String(req.params.users_id);
      const result = await selectRecipesByUserId(users_id);
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (err) {
      res.send(err);
    }
  },

  insertRecipes: async (req, res) => {
    try {
      // const { error, value } = recipeSchema.validate(req.body);
      // if (error) {
      //   return res.status(400).json({ error: error.details[0].message });
      // }

      const { title, ingredients, users_id, title_video, video } = req.body;
      const id = uuidv4();
      const photoResult = await cloudinary.uploader.upload(
        req.files.photo[0].path
      );

      let video2Url = null;
      let video3Url = null;

      if (req.files.video2) {
        const video2Result = await cloudinary.uploader.upload(
          req.files.video2[0].path,
          {
            resource_type: "video",
          }
        );
        video2Url = video2Result.secure_url;
      }
      if (req.files.video3) {
        const video3Result = await cloudinary.uploader.upload(
          req.files.video3[0].path,
          {
            resource_type: "video",
          }
        );
        video3Url = video3Result.secure_url;
      }

      const data = {
        id,
        title,
        ingredients,
        photo: photoResult.secure_url,
        title_video,
        video,
        video2: video2Url,
        video3: video3Url,
        users_id,
      };

      insertRecipes(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Berhasil Membuat Resep")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateRecipes: async (req, res) => {
    try {
      // const { error, value } = updateSchema.validate(req.body);
      // if (error) {
      //   return res.status(400).json({ error: error.details[0].message });
      // }
      const { title, ingredients, title_video, video } = req.body;
      const id = String(req.params.id);
      const getData = await selectRecipesById(id);
      const recipe = getData.rows[0];

      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }

      if (req.files.photo && req.files.photo[0].path) {
        const result = await cloudinary.uploader.upload(
          req.files.photo[0].path
        );
        photo = result.secure_url;
      }

      let video2Url = null;
      let video3Url = null;
      if (req.files.video2) {
        const video2Result = await cloudinary.uploader.upload(
          req.files.video2[0].path,
          {
            resource_type: "video",
          }
        );
        video2Url = video2Result.secure_url;
      }
      if (req.files.video3) {
        const video3Result = await cloudinary.uploader.upload(
          req.files.video3[0].path,
          {
            resource_type: "video",
          }
        );
        video3Url = video3Result.secure_url;
      }

      const data = {
        id,
        title: title || recipe.title,
        ingredients: ingredients || recipe.ingredients,
        photo: photo || recipe.photo,
        title_video: title_video || recipe.title_video,
        video: video || recipe.video,
        video2: video2Url,
        video3: video3Url,
      };
      updateRecipes(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Product updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteRecipe: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      await deleteRecipes(id);
      commonHelper.response(res, {}, 200, "Recipe deleted");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = recipesController;
