const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
	accessKeyId: process.env.AWS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

module.exports = {
	uploadFile({ fileContent, key } = {}) {
		return new Promise((resolve, reject) => {
			const params = {
				Body: fileContent,
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
			}
			s3.upload(params, (err, data) => err ? reject(err) : resolve(data))
		})
	}
}
