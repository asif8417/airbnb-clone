const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config(
    {
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_API,
        api_secret:process.env.SECRET_API
    });

    const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'worldlust_DEV',
    aloowedFormat: ["png","jpeg","jpg"], // supports promises as well
  },
});

module.exports={
    cloudinary,
    storage,
}