const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

// Performs the MPU
function uploadFile(filePath, bucketName, testOrRun) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
  });

  // Upload
  var buffer = fs.readFileSync("./" + filePath);
  var startTime = new Date();
  var partNum = 0;
  // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html
  var partSize = 1024 * 1024 * 5; 
  var numPartsLeft = Math.ceil(buffer.length / partSize);
  var maxUploadTries = 3;
  var multiPartParams = {
    Bucket: bucketName,
    Key: filePath,
  };

  var multipartMap = {
    Parts: [],
  };

  // Sends a request to Amazon S3 to complete the upload and create a new object
  function completeMultipartUpload(s3, doneParams) {
    s3.completeMultipartUpload(doneParams, function (err, data) {
      if (err) {
        if (testOrRun === "r") {
          console.log(
            "An error occurred while completing the multipart upload"
          );
          if (testOrRun === "r") {
            console.log(err);
          }
        }
      } else {
        var delta = (new Date() - startTime) / 1000;
        if (testOrRun === "r") {
          console.log("Completed upload in", delta, "seconds");
          console.log("Final upload data:", data);
        }
      }
    });
  }

  // Uploads a part of the file 
  function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function (multiErr, mData) {
      if (multiErr) {
        console.log("multiErr, upload part error:", multiErr);
        if (tryNum < maxUploadTries) {
          console.log("Retrying upload of part: #", partParams.PartNumber);
          uploadPart(s3, multipart, partParams, tryNum + 1);
        } else {
          if (testOrRun === "r") {
            console.log("Failed uploading part: #", partParams.PartNumber);
          }
        }
        return;
      }

      multipartMap.Parts[this.request.params.PartNumber - 1] = {
        ETag: mData.ETag,
        PartNumber: Number(this.request.params.PartNumber),
      };
      if (testOrRun === "r") {
        console.log("Completed part", this.request.params.PartNumber);
        console.log("mData", mData);
      }

      if (--numPartsLeft > 0) return; // complete only when all parts uploaded
      var doneParams = {
        Bucket: bucketName,
        Key: filePath,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId,
      };

      if (testOrRun === "r") {
        console.log("Completing upload...");
      }
      completeMultipartUpload(s3, doneParams);
    });
  }
  // Multipart

  if (testOrRun === "r") {
    console.log("Creating multipart upload for:", filePath);
  }

  // Splits the file to several parts and uploads them
  s3.createMultipartUpload(multiPartParams, function (mpErr, multipart) {
    if (mpErr) {
      if (testOrRun === "r") {
        console.log("Error!", mpErr);
      }
      return;
    }

    if (testOrRun == "r") {
      console.log("Got upload ID", multipart.UploadId);
    }

    // Grab each partSize chunk and upload it as a part
    for (
      var rangeStart = 0;
      rangeStart < buffer.length;
      rangeStart += partSize
    ) {
      partNum++;
      var end = Math.min(rangeStart + partSize, buffer.length),
        partParams = {
          Body: buffer.slice(rangeStart, end),
          Bucket: bucketName,
          Key: filePath,
          PartNumber: String(partNum),
          UploadId: multipart.UploadId,
        };

      // Send a single part
      if (testOrRun === "r") {
        console.log(
          "Uploading part: #",
          partParams.PartNumber,
          ", Range start:",
          rangeStart
        );
      }
      uploadPart(s3, multipart, partParams);
    }
  });
}

module.exports = uploadFile;
