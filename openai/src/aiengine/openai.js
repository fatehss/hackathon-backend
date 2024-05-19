import dotenv from "dotenv";
import OpenAI from "openai";
import { CREATE, DELETE, READ, UPDATE } from "./crud.js";
// Load environment variables from .env file
dotenv.config();

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


`;
  let prompt = `based on the following information, return in this format <<<${format}>>>json the type of crud action(s) we would use (CREATE, READ, UPDATE, DELETE): ${order}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  // let names = JSON.parse(completion.choices[0]['message']['content']);
  // var out = JSON.stringify(names);
  // console.log(out);

  const CRUD = JSON.parse(completion.choices[0]["message"]["content"]);
  console.log(JSON.stringify(CRUD));

  let response = "";
  for (const key in CRUD) {
    console.log(`\n\n_______KEY ${key}________\n\n`);
    let crudOperationOutput = "";
    switch (key) {
      case "READ":
        crudOperationOutput = await READ(order, CRUD[key]);
        break;
      case "CREATE":
        crudOperationOutput = await CREATE(CRUD[key]);
        break;
      case "UPDATE":
        crudOperationOutput = await UPDATE(CRUD[key]);
        break;
      case "DELETE":
        crudOperationOutput = await DELETE(CRUD[key]);
        break;
    }

    if (crudOperationOutput ==  undefined || crudOperationOutput == "undefined") {
      console.log("skipped")
    } else {
      console.log(`type ${typeof crudOperationOutput}`)
      console.log(`value ${crudOperationOutput}`)
      response = response + crudOperationOutput + "\n";
    }
  }

  console.log("\n\n\nFINAL RESPONSE: _________\n\n");
  console.log(response);
  return response;
}

export async function negativeOrPositive(order) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const format = `
{
  "result": boolean
}
`;

  let prompt = `based on the sentence, return in this format <<<${format}>>>json weather or not the sentence is an error, negative, not found or a positive and normal one. return true for positive and false for negative: ${order}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  // let names = JSON.parse(completion.choices[0]['message']['content']);
  // var out = JSON.stringify(names);
  // console.log(out);

  const negativeOrPositive = JSON.parse(
    completion.choices[0]["message"]["content"]
  );
  console.log(JSON.stringify(negativeOrPositive));

  return negativeOrPositive;
}
/*
bring up the problem at the start of the pitch
- medical data is often incomplete, 
replace retool - use for customer service - point chat app at the database
ai agent
*/
