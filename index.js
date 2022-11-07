#! /usr/bin/env node
const { program } = require("commander");
const uploadFile = require("./mpuFunc");
const headObject = require("./programTesting.js");
const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

//creates a command line command for MPU
program
  .command("mpu <filePath bucketName>")
  .description("start multipart uplode")
  .action(mpu);

//a function that runs the command mentioned above via the command line
function mpu(filePath, bucketName) {
  uploadFile(filePath, bucketName, "r");
}

//creates a command for MPU testing
program
  .command("test <filePath bucketName fileSize>")
  .description("testing of multipart uploade")
  .action(test);

//a function that runs the command above mentioned via the command line
async function test(filePath, bucketName, fileSize) {
  console.log("Starts testings \nIt will take up to a couple of minutes (dependent on the file size) \nPlease wait...\n");
  uploadFile(filePath, bucketName, "t");
  
  await new Promise((resolve, reject) => setTimeout(resolve, fileSize * 200));

  headObject(filePath,bucketName);
}

program.parse();
