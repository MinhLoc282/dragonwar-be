import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    BUCKET_NAME,
    FILE_KEY
  } from '../config';

const AWS = require('aws-sdk');
const fs = require('fs');
const expirationTime = 7 * 24 * 60 * 60; // 7 days in seconds
// Configure the AWS SDK with your credentials
const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});


export const getSignedUrlWithFileName = (fileName) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        Expires: expirationTime
      };
      
    return s3.getSignedUrl('getObject', params, (err, url) => {
          if (err) {
            console.error('Error getting signed URL from S3:', err);
            return res.status(500).send('Error getting signed URL from S3');
          }
    });  
}