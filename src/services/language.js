const axios = require('axios')

const requiredParam = (param = 'query') => {
  throw new Error(`The required param, ${param}, was not provided`)
}

module.exports = {
  analyzeSentiment(query = requiredParam()) {
    const document = {
      content: query,
      type: 'PLAIN_TEXT',
    }
    const googleAnalyzeSentimentUrl = 'https://language.googleapis.com/v1/documents:analyzeSentiment'
    return axios.post(`${googleAnalyzeSentimentUrl}?key=${process.env.GOOGLE_API_KEY}`, { document })
  },
}
