const multer = require("multer");

const multerVideoUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const maxSize = 100 * 1024 * 1024; 
    if (file.size > maxSize) {
      const error = {
        message: "File size exceeds 100 MB",
      };
      return cb(error, false);
    }
    if (file.mimetype === "video/mp4" || file.mimetype === "video/mpeg") {
      cb(null, true);
    } else {
      const error = {
        message: "File must be mp4 or mpeg video",
      };
      cb(error, false);
    }
  },
});

const uploadVideo = (req, res, next) => {
    const multerSingle = multerVideoUpload.single("video");
    multerSingle(req, res, (err) => {
      if (err) {
        res.status(500).send("Kesalahan Unggah Berkas: " + err.message);
      } else {
        next();
      }
    });
  };
  
  module.exports = uploadVideo;
  