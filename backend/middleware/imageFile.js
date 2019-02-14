const multer = require("multer");

const MIME_TIPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};
// multer configuration:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const inValid = MIME_TIPE_MAP[file.mimetype];
    let error = "mime type is invalid";
    if (inValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TIPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");
