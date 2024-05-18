import OpenAI from "openai";
import dotenv from "dotenv";
import {CREATE, READ, UPDATE, DELETE} from "./crud.js"
// Load environment variables from .env file
dotenv.config();

// let prompt = "in the following information, return the name(s) of the individual in json format like <<{\"names\": [\"x\",\"y\"]}>>. provide the response in just json and nothing else. here is the content: <<give me a summary of the health issues of patients john deere, fateh sandhu, and virat kohli>>"
 let order = "tell me about the health of John Doe.";
// let order = "update john doe's weight to 150, height to 180";
// let order = "create a patient called fateh sandhu in the database with height 176 and weight 74, medical conditions of kidney stones. update dude guy's weight to 89.";


export async function performCrudOperations(order) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const format = `
{
  "READ": [
    "name1",
    "name2"
  ],
  "CREATE": [
    {
      "name1": {
        "attribute1": "value1",
        "attribute2": "value2"
      }
    }
  ],
  "UPDATE": [
    {
      "name2": {
        "attribute1": "new_value1"
      }
    }
  ],
  "DELETE": [
    "name3"
  ]
}


`
let prompt = `based on the following information, return in this format <<<${format}>>>json the type of crud action(s) we would use (CREATE, READ, UPDATE, DELETE): ${order}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o",
    response_format: {"type": "json_object"}
  });
  // let names = JSON.parse(completion.choices[0]['message']['content']);
  // var out = JSON.stringify(names);
  // console.log(out);

  const CRUD = JSON.parse(completion.choices[0]['message']['content']);
  console.log(JSON.stringify(CRUD))

  let response = ""
  for (const key in CRUD) {
    console.log(`\n\n_______KEY ${key}________\n\n`);
    let crudOperationOutput = ""
    switch (key)
    {
      case 'READ':
        crudOperationOutput = await READ(order, CRUD[key]);
        break;
      case 'CREATE':
        crudOperationOutput = await CREATE(CRUD[key]);
        break;
      case 'UPDATE':
        crudOperationOutput = await UPDATE(CRUD[key]);
        break;
      case 'DELETE':
        crudOperationOutput = await DELETE(CRUD[key]);
        break;
    };
    response = response + crudOperationOutput + '\n';
  }

  console.log("\n\n\nFINAL RESPONSE: _________\n\n");
  console.log(response)
  return response;


}

/*
bring up the problem at the start of the pitch
- medical data is often incomplete, 
replace retool - use for customer service - point chat app at the database
ai agent
*/