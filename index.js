require('dotenv').config()
const CronJob = require('cron').CronJob
const googleTrends = require('google-trends-api')
const s3 = require('./services/s3')

const today = () => {
	const now = new Date()
	const day = ("0" + now.getDate()).slice(-2)
	const month = ("0" + (now.getMonth() + 1)).slice(-2)
	const today = `${now.getFullYear()}${month}${day}`
	return today
}

const job = async () => {
	try {
		const geo = 'US'
		const res = await googleTrends.dailyTrends({ geo })
		await s3.uploadFile({
			fileContent: res,
			key: `${today()}_${geo}`,
		})
		console.log('Successfully uploaded to s3', res)
	} catch (err) {
		console.error(err)
	}
}

const everyDay = '0 20 * * *' // CronJob occuring every day at 20:00, 8pm
new CronJob(everyDay, job, null, true, 'America/Los_Angeles')
console.log(`CronJob occuring every ${everyDay}`)
