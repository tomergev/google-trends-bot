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
  // Checking if the file name already exists in s3
  checkFileName(key = requiredParam()) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket,
          Key: key,
        }
        const data = await s3.headObject(params).promise()
        if (data) {
          reject(new Error(`The file ${key} already exists in s3`))
        }
        resolve()
      } catch (err) {
        if (err && !err.statusCode === 404) {
          reject(new Error(err))
        }
        resolve()
      }
    })
  },
  async getObject(key = requiredParam()) {
    const params = {
      Bucket,
      Key: key,
    }
    const { Body } = await s3.getObject(params).promise()
    const inflatedBody = zlib.inflateSync(Buffer.from(Body.toString(), 'base64'))
    return inflatedBody.toString()
  },
  async uploadFile({ fileContent = requiredParam('fileContent'), key = requiredParam() }) {
    await this.checkFileName(key)
    return s3.upload({
      Body: zlib.deflateSync(fileContent).toString('base64'),
      Bucket,
      Key: key,
    }).promise()
	},
}
