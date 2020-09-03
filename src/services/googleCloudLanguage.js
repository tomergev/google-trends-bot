// Imports the Google Cloud client library
const language = require('@google-cloud/language')
// Instantiates a client
const client = new language.LanguageServiceClient()

const detect = async () => {
  try {
    // The text to analyze
    const text = 'Hello, world!'

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    }

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document})
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  detect,
}
