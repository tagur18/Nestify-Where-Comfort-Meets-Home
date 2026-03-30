const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');  


cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Air-bnb_DEV',
<<<<<<< HEAD
    allowedFormats:  ["png","jpg","jpeg"],
=======
    allowed_formats:  ["png","jpg","jpeg"],
>>>>>>> d2d455c (updated search bar text)

  },
});
module.exports = {
    cloudinary,
    storage,
}

