const express = require("express");
const router = express.Router();
const usersRouter = require("./usersRouters");
const recipesRouter = require("./recipesRouter");
const likedsRouter = require("./likedsRouter");
const bookmarksRouter = require("./bookmarksRouter");
const commentsRouter = require("./commentsRouter");



router.use("/users", usersRouter);
router.use("/recipes", recipesRouter);
router.use("/likeds", likedsRouter);
router.use("/bookmarks", bookmarksRouter);
router.use("/comments", commentsRouter);

module.exports = router;
