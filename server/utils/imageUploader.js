const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file , folder , quality , height) => {
   const options = {folder}; // make sure to make option by creating an object

   if(quality )
   {
     options.quality = quality;
   }

   if(height) {
      options.height = height;
   }

   options.resource_type = 'auto';

   return await cloudinary.uploader.upload(file.tempFilePath , options);
}