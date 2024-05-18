import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// let prompt = "in the following information, return the name(s) of the individual in json format like <<{\"names\": [\"x\",\"y\"]}>>. provide the response in just json and nothing else. here is the content: <<give me a summary of the health issues of patients john deere, fateh sandhu, and virat kohli>>"
let order = "give me a summary of the health issues of patients Diana Prince and Joe Schmoe and update the latter's weight to 150. remove dave schapelle from the db."
// let order = "create a patient called fateh sandhu in the database with height 176 and weight 74, medical conditions of kidney stones. update dude guy's weight to 89.";
// const format = "format {crud_action: [{<ACTION_1>:[{<PATIENT1_NAME>:{<RELEVANT FIELD>: value}, <PATIENT2_NAME>:{<RELEVANT FIELD>: value} }]},{<ACTION_2>:[{<PATIENT1_NAME>:{<RELEVANT FIELD>: value}, <PATIENT2_NAME>:{<RELEVANT FIELD>: value} }]}]})" 

// const format = `
// <<if needed>> "READ": ["name1", "name2"],
// <<if needed>> "CREATE": [{"name_x": {dictionary of attributes}}..],
// <<if needed>> "UPDATE": [{"name":[{dictionary of updates}] }, ...] ],
// <<if needed>> "DELETE": ["name_a", "name_b", ...]
// `

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
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o",
    response_format: {"type": "json_object"}
  });
  // let names = JSON.parse(completion.choices[0]['message']['content']);
  // var out = JSON.stringify(names);
  // console.log(out);

  let CRUD = JSON.parse(completion.choices[0]['message']['content']);
  console.log(JSON.stringify(CRUD))

  for (var i =0; i < CRUD.length; i++)
  {
    console.log(`loop ${i}\n`)
    console.log(JSON.stringify(CRUD[i]));
  }

}

main();

/*
bring up the problem at the start of the pitch
- medical data is often incomplete, 
replace retool - use for customer service - point chat app at the database
ai agent
*/