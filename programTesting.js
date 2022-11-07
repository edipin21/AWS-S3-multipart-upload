const AWS = require("aws-sdk");

// checks if the file was uploaded successfully

function headObject(filePath,bucketName) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
  });

  var multiPartParams = {
    Bucket: bucketName,
    Key: filePath,
  };
  //API that returns the file details, or an error in case the file does not exist or does not accessible 
  s3.headObject(multiPartParams, function (err, data) {
    if (err) {
      console.log("Failed!");
    } else {
      console.log("The test was completed successfully :) ");
    }
  });
};

module.exports = headObject;