const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
const {
  selectAllUsers,
  selectUsers,
  deleteUsers,
  createUsers,
  updateUsers,
  updatePasswordUsers,
  findUUID,
  findEmail,
  countData,
} = require("../model/usersModel");

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string().min(10).required().messages({
    "string.min": "Phone number must be at least {#limit} digits",
    "any.required": "Phone number is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least {#limit} characters",
    "any.required": "Password is required",
  }),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password",
    "any.required": "Confirm password is required",
  }),
  photo: Joi.string().allow("").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  confirmpassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least {#limit} characters",
    "any.required": "Password is required",
  }),
});

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllUsers({ limit, offset, sort, sortby });
      const {
        rows: [{ count }],
      } = await countData();
      const totalData = parseInt(count);
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
        "Get Users Data Success",
        pagination
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  getSelectUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return res.json({ message: "ID Not Found" });
      }
      const result = await selectUsers(id);
      commonHelper.response(res, result.rows, 200, "Get Users Detail Success");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  registerUsers: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const id = uuidv4();
      const { name, email, phone, password, confirmpassword } = value;
      const passwordHash = bcrypt.hashSync(password, 10);
      const confirmpasswordHash = bcrypt.hashSync(confirmpassword, 10);

      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({ message: "Email Already Taken" });
      }

      const data = {
        id,
        name,
        email,
        phone,
        passwordHash,
        confirmpasswordHash,
        photo: "",
      };
      const result = await createUsers(data);
      commonHelper.response(res, result.rows, 201, "Create User Success");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  updateUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const getUserId = await selectUsers(id);
      const user = getUserId.rows[0];
     
      const { file } = req;
      let photo = user.photo;
      if (file && file.path) {
        const result = await cloudinary.uploader.upload(file.path);
        photo = result.secure_url;
      }
      const { name } = req.body;
      const data = {
        id,
        name:name || user.name,
        photo: photo || user.photo,
      };

      updateUsers(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteUsers(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginUsers: async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, confirmpassword } = req.body;
    const {
      rows: [users],
    } = await findEmail(email);
    if (!users) {
      return res.status(400).json({ message: "Email not found" }); 
    }
    const isValidPassword = bcrypt.compareSync(
      confirmpassword,
      users.confirmpassword
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password" }); 
    }
    delete users.confirmpassword;
    const payload = {
      email: users.email,
    };
    users.token = authHelper.generateToken(payload);
    users.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, users, 201, "Login Successfuly");
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};
module.exports = usersController;
