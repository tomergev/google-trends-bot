require('dotenv').config()
const CronJob = require('cron').CronJob
const googleTrends = require('google-trends-api')
const s3 = require('./services/s3')

// Get the date from googleTrends.dailyTrends response
const getDate = ({ default: res = {} } = {}) => {
	const [{ date }] = res.trendingSearchesDays || []
	return date
}

const job = async () => {
	try {
		const geo = 'US'
		const res = await googleTrends.dailyTrends({ geo })
		await s3.uploadFile({
			fileContent: res,
			key: `${getDate(JSON.parse(res))}_${geo}`,
		})
		console.log(res, 'Successfully uploaded to s3')
	} catch (err) {
		console.error(err)
	}
}

const everyDay = '0 20 * * *' // CronJob occuring every day at 20:00, 8pm
new CronJob(everyDay, job, null, true, 'America/Los_Angeles')
console.log(`CronJob occuring every ${everyDay}`)