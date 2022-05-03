require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;
const endpoint = process.env.END_POINT

//Create s3 instance
const s3 = new S3({
    endpoint,
    region,
    credentials:{
        accessKeyId,
        secretAccessKey
    }
});

//Upload file to Cloud
const uploadFile = (file,fileName)=>{
    const uploadParams = {
        Bucket: bucketName,
        Body: file,
        Key: fileName,
        ContentType: 'audio/mpeg'
    };
    return s3.upload(uploadParams).promise();
};

//Stream file from Cloud
const streamFile = (fileKey) =>{
    const downloadParams = {
        Key: fileKey,
        Bucket:bucketName
    };
    return s3.getObject(downloadParams).createReadStream();
};

//Download file from Cloud
const downloadFile = (fileKey) =>{
    const downloadParams = {
        Key: fileKey,
        Bucket:bucketName
    };
    return s3.getObject(downloadParams)
};

//Delete file from Cloud
const deleteFile = (fileKey) =>{
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    };

    s3.deleteObject(deleteParams).promise();
    console.log("Deleted",fileKey)
};

module.exports = {
    uploadFile,
    downloadFile,
    deleteFile,
    streamFile
};