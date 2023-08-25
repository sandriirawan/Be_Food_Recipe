const express = require("express");
const router = express.Router();
const bookmarksController = require("../controller/bookmarksController");
router
  .get("/", bookmarksController.getAllBookmarks)
  .get("/:users_id", bookmarksController.getSelectBookmarks)
  .post("/", bookmarksController.insertBookmarks)
  .delete("/:id", bookmarksController.deleteBookmarks);
module.exports = router;
