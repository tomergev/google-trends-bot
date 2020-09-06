require('dotenv').config()
const { analyzeSentiment } = require('./services/language')
const CronJob = require('cron').CronJob
const get = require('lodash.get')
const googleTrends = require('google-trends-api')
const s3 = require('./services/s3')

const PATH = 'default.trendingSearchesDays.0' // Path to the current trending searches for the current date

const fetchTrendingSentiment = async (trends, index = 0) => {
	const trend = get(trends, `${PATH}.trendingSearches.${index}`)
	const { query } = trend.title || {}
	const { data } = await analyzeSentiment(query)
	const sentimentScore = get(data, 'documentSentiment.score') || 0
	// If the sentiment score is higher than 0 (positive sentiment), then return the data concerning this trend
	// If the sentiment score is 0 or lower, than recursively call this same function again
	if (sentimentScore > 0) {
		return console.log(`Today, the search: ${query}, has been searched for ${trend.formattedTraffic}. Link: ${trend.shareUrl}`)
		// return {
		// 	formattedTraffic: trend.formattedTraffic,
		// 	imageUrl: get(trend, 'image.imageUrl'),
		// 	shareUrl: trend.shareUrl,
		// 	query,
		// }
	}
	return await fetchTrendingSentiment(trends, index += 1)
}

const job = async () => {
	try {
		const geo = 'US'
		const trends = await googleTrends.dailyTrends({ geo })
		const parsedTrends = JSON.parse(trends)
		Promise.all([
			fetchTrendingSentiment(parsedTrends).catch(console.error),
			s3.uploadFile({
				fileContent: trends,
				key: `${get(parsedTrends, `${PATH}.date`)}_${geo}`,
			})
				.then(() => console.log('Successfully uploaded to s3'))
				.catch(console.error)
		])
	} catch (err) {
		console.error(err)
	}
}

const everyDay = '0 20 * * *' // CronJob occuring every day at 20:00, 8pm
new CronJob(everyDay, job, null, true, 'America/Los_Angeles')
console.log(`CronJob occuring every ${everyDay}`)
