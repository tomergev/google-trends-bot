const axios = require('axios')

module.exports = {
  analyzeSentiment(query) {
    const document = {
      content: query,
      type: 'PLAIN_TEXT',
    }
    const googleAnalyzeSentimentUrl = 'https://language.googleapis.com/v1/documents:analyzeSentiment'
    return axios.post(`${googleAnalyzeSentimentUrl}?key=${process.env.GOOGLE_API_KEY}`, { document })
  },
}
