AWS S3 Multipart Uploade Project (Written in NodeJS/JavaScript)

The application is designed for uploading a big-size file to the AWS S3 Cloud via Amazon S3 API.
The app takes a file and splits it into small chunks of 5 mb minimum that can be uploaded in parallel. Every part gets a part number which is defined by the app, and an entity tag (ETag) which is returned by Amazon while uploading. After all the parts have been uploaded, the app complete the process by combining the upload ID and the list of both part numbers and corresponding ETag values in order to restore the original file. 


For runinng the project:

1. Download the project to your PC.

2. In the .env file enter (in quotes) the ***ID*** and the ***SECRET*** values of your AWS S3 account. (You can get ID and SECRET values from https://console.aws.amazon.com/iam/).

3. Open a new command line window from 'AWS-S3-multipart-upload' folder.

4. Run the command: npm i

5. Run the command: npm i -g
 
** For Mac users only:
    In case you encounter a permission error 
    ('npm ERR! code EACCES
      npm ERR! syscall symlink') 
    while running the program via the command line, run this command: 
    xattr -d com.apple.quarantine /PATH/TO/index.js

Now the project is ready for use. 
To upload a file, run the command: 

s3mpu mpu  ***filePath***  ***bucketName***

filePath = your file path
bucketName= your bucket name

_______________________________________________________________________________________________________________________________________________

To test the code:

1. In case you have not run the program yet, please perform steps 1-5 that are mentioned above. 
  Otherwise, you can pass to step 2 below.  

2. Run the command:

  s3mpu test  ***filePath*** ***bucketName*** ***fileSize***

  filePath = your file path
  bucketName = your bucket name
  fileSize = your file size in MB 

  ** Please round the file size value 
  ** Please make sure that the file have not existed yet on S3

_______________________________________________________________________________________________________________________________________________

Project technologies:

nodejs,npm and the programing language is java screipt.


Environment set up:

 1. For checking and editing the code, you can download the Code Editor Visual Studio Code 
 (link: https://code.visualstudio.com/download) or any code editor you like.

 2. Download and install the last version of NodeJS and npm (link:https://nodejs.org/en/).
    To confirm node and npm installation, open the command line window and type:
    node -v and npm -v    

** The program was run and tested on:
  Macos, Windows 10


That is it, you are ready to use the app!
Enjoy :) 