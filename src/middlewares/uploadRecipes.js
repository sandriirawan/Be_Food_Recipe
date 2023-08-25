const multer = require("multer");
const { failed } = require("../helper/common");

const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const maxSize = 100 * 1024 * 1024; // 100 MB limit for videos
    const maxSizeImage = 2 * 1024 * 1024; // 2 MB limit for images
    
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      if (file.size > maxSizeImage) {
        const error = {
          message: "File size exceeds 2 MB",
        };
        return cb(error, false);
      } else {
        cb(null, true);
      }
    } else if (file.mimetype === "video/mp4" || file.mimetype === "video/mpeg") {
      if (file.size > maxSize) {
        const error = {
          message: "File size exceeds 100 MB",
        };
        return cb(error, false);
      } else {
        cb(null, true);
      }
    } else {
      const error = {
        message: "File must be jpeg, jpg, png, mp4, or mpeg",
      };
      cb(error, false);
    }
  },
});

// middleware
const uploadPhotoAndVideo = (req, res, next) => {
  const multerSingle = multerUpload.fields([{ name: "photo", maxCount: 1 }, { name: "video2", maxCount: 1 }, { name: "video3", maxCount: 1 }]);
  multerSingle(req, res, (err) => {
    if (err) {
      res.status(500).send("Kesalahan Unggah Berkas: " + err.message);
    } else {
      next();
    }
  });
};

module.exports = uploadPhotoAndVideo;
