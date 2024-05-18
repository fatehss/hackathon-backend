const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getHelloWorld() {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say "Hello, World!"' }],
    });

    const completion = response.data.choices[0].message.content;
    console.log(completion);
  } catch (error) {
    console.error('Error querying OpenAI:', error);
  }
}

getHelloWorld();
