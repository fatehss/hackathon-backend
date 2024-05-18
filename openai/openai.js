import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let prompt = "in the following information, return the name(s) of the individual in json format like <<{\"names\": [\"x\",\"y\"]}>>. provide the response in just json and nothing else. here is the content: <<give me a summary of the health issues of patients john deere, fateh sandhu, and virat kohli>>"
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: {"type": "json_object"}
  });
  let names = JSON.parse(completion.choices[0]['message']['content']);
  console.log(names);

}

main();