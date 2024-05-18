import OpenAI from "openai";
import dotenv from "dotenv";
import { MongoClient } from 'mongodb';

// Load environment variables from .env file
dotenv.config();
// Connection URL
const uri = "mongodb://localhost:27017";
const order = "give me a summary of the health issues of patients Diana Prince"
// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let prompt = `in the following information, return the name(s) of the individual in json format like <<{\"names\": [\"x\",\"y\"]}>>. provide the response in just json and nothing else. here is the content: <<${order}>>`
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: {"type": "json_object"}
  });
  let people = JSON.parse(completion.choices[0]['message']['content']);
  console.log(people);

  //now do the mongodb 

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to server");

    // Specify the database and collection
    const database = client.db('test');
    const collection = database.collection('patients');

    const query = {name: people["names"][0]}

    const info = await collection.findOne(query);

    if (info) {
        console.log("Found a document':", info);

        let new_prompt = order + `, given the context: ${info}`;
        const completion2 = await openai.chat.completions.create({
            messages: [{ role: "system", content: new_prompt }],
            model: "gpt-3.5-turbo"
          });
        console.log(`\n\nHere is the response: ${completion2.choices[0]["message"]["content"]}`)
    } else {
        console.log("No document found");
    }
   // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    

} catch (err) {
    console.error(err);
} finally {
    // Close the connection to the MongoDB server
    await client.close();
}
}

main();