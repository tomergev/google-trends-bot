const CronJob = require('cron').CronJob
const fs = require('fs')
const googleTrends = require('google-trends-api')

const today = () => {
	const now = new Date()
	const day = ("0" + now.getDate()).slice(-2)
	const month = ("0" + (now.getMonth() + 1)).slice(-2)
	const today = `${now.getFullYear()}${month}${day}`
	return today
}

// CronJob occuring every day at noon
new CronJob('0 12 * * *', async () => {
  try {
		const res = await googleTrends.dailyTrends({ geo: 'US' })
		const filePath = `raw/${today()}_${Date.now()}.json`
		await fs.writeFileSync(filePath, res)
		console.log(`Successfully created file, path: ${filePath}`, res)
	} catch (err) {
		console.error(err)
	}
}, null, true, 'America/Los_Angeles')
