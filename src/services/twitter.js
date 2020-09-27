const Twitter = require('twitter')

const twitter = new Twitter({
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
})

module.exports = {
  postTweet(status) {
    return new Promise((resolve, reject) => {
      twitter.post('statuses/update', { status }, (err, tweet) => {
        if (err) return reject(err)
        console.log(`Successfully tweeted: ${tweet.text}`)
        resolve(tweet)
      })
    })
  }
}
