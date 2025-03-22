const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "upload";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqSuffix + path.extname(file.originalname)); 
  },
});

// File filter function
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {  // ✅ Fixed
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"), false);  // ✅ Fixed
  }
};

// Multer middleware
module.exports = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});
