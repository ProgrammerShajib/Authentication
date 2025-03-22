const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {uploadImageController,fetchImagesController,deleteImageController} = require("../controller/image-controller");

const router = express.Router();

//  upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

//  to get all the images

router.get("/get",authMiddleware,fetchImagesController)

// Delete image route
// 67d2cb5b7b703c28f834c504
router.delete('/:id',authMiddleware,adminMiddleware, deleteImageController);

module.exports = router;
