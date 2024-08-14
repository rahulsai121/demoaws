const AWS = require('aws-sdk');
require('dotenv').config();

async function uploadToS3(data, filename) {
    const bucketname = 'expensetracker121'
    const accesskey = process.env.AWS_ACCESS_KEY
    const secretkey = process.env.AWS_SECRET_ACCESS_KEY

    let s3bucket = new AWS.S3({
        accessKeyId: accesskey,
        secretAccessKey: secretkey
    })

    console.log(bucketname)

    var params = {
        Bucket: bucketname,
        Key: filename,
        Body: data,
        ACL:'public-read'

    }
    try {
        const s3res = await s3bucket.upload(params).promise();
        return s3res.Location;
    } catch (err) {
        console.error('Error in s3bucketupload', err);
        throw err; 
    }
}

module.exports=uploadToS3