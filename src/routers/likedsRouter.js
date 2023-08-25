const express = require("express");
const router = express.Router();
const likedsController = require("../controller/likedsController");
router
  .get("/", likedsController.getAllLikeds)
  .get("/:users_id", likedsController.getSelectLikeds)
  .post("/", likedsController.insertLikeds)
  .delete("/:id", likedsController.deleteLikeds);
module.exports = router;
