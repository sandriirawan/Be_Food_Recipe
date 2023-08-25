const express = require("express");
const router = express.Router();
const uploadUsers = require("../middlewares/uploadUsers");
const usersController = require("../controller/usersController");
router
  .post("/register", usersController.registerUsers)
  .post("/login", usersController.loginUsers)
  .get("/:id", usersController.getSelectUsers)
  .get("/", usersController.getAllUsers)
  .put("/:id", uploadUsers, usersController.updateUsers)
  // .put("/password/:id", uploadUsers, usersController.updatePasswordUsers)
  .delete("/:id", usersController.deleteUsers);
module.exports = router;
