const Image = require("../models/imageModels");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const  cloudinary  = require("../config/cloudinary");

const fs = require('fs');
const { toASCII } = require("punycode");

const uploadImageController = async (req, res) => {
  try {
    // Check if file is missing in the req

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required! Please upload and image.",
      });
    }

    // upload to cloudinary
    //  if we have the file then upload it to cloudinary

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //  after upload store the image url and public id alogn with the uploaded user id

    // here userInfo is returned from auth-middleware
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    //  then we will save it to our database

    await newlyUploadedImage.save();
    fs.unlinkSync(req.file.path);


    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something is went wrong! Please try again.",
    });
  }
};

const fetchImagesController = async (req, res) =>{
  try {

    let {page, limit} = req.query;

    // Convert to numbers and set default values
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 3;

    // calculate how many documents to skip 
    const skip = (page - 1) * limit ;

    // Fetch total count of images

    const totalImages = await Image.countDocuments();

    // Fetch paginated images and populate uploadedBy field
     const Images = await Image.find({})
     .populate("uploadedBy" , "username email")
     .skip(skip)
     .limit(limit)
     .sort({createdAt: -1});



  // Calculate total pages
  const totalPages = Math.ceil(totalImages / limit);


 
    if(totalImages) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPage: totalPages,
        toatalImages: totalImages,
        data: Images
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something is went wrong! Please try again.",
    })
  }
}

const deleteImageController = async (req, res)=>{
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if(!image){
      return res.status(404).json({
        success:false,
        message: "Image is not found."
      })
    }

    // Check if this image is uploaded by te current user who is trying to delete this image

    if(image.uploadedBy.toString() !== userId){
      return res.status(403).json({
        success: false,
        message: "You are not authorize to delete this image because you havn't uploaded!"
      })
    }


    // if image is uploaded by user then delete it

    // So first delete this image from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);


    // Delete this image from mongodb data base

    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully."
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something is went wrong! Please try again.",
    })
  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController
};
