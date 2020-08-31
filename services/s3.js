const S3 = require('aws-sdk/clients/s3')
const zlib = require('zlib')
const { S3_BUCKET_NAME: Bucket } = process.env

const s3 = new S3({
	accessKeyId: process.env.AWS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const requiredParam = (param = 'key') => {
  throw new Error(`The required param, ${param}, was not provided`)
}

module.exports = {
  async getObject({ key = requiredParam() } = {}) {
    const params = {
      Bucket,
      Key: key,
    }
    const { Body } = await s3.getObject(params).promise()
    const inflatedBody = zlib.inflateSync(Buffer.from(Body.toString(), 'base64'))
    return inflatedBody.toString()
  },
  async uploadFile(args = {}) {
    const {
      fileContent = requiredParam('fileContent'),
      key = requiredParam(),
    } = args

    const params = {
      Bucket,
      Key: key,
    }

    // Checking if the file name already exists in s3
    await s3.headObject(params, (err, data) => {
      if (err && !err.statusCode === 404) {
        throw new Error(err)
      }
      if (data) {
        throw new Error(`The file ${key} already exists in s3`)
      }
    })

    params.Body =  zlib.deflateSync(fileContent).toString('base64')
    return s3.upload(params).promise()
	},
}
