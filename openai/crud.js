import OpenAI from "openai";
import dotenv from "dotenv";
import { MongoClient } from 'mongodb';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
// functions.js
export async function READ(prompt, input) {
    // assumes input in the form {READ: [names]}
    const uri = "mongodb://localhost:27017";
    
    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected successfully to server");

        // Specify the database and collection
        const database = client.db('test');
        const collection = database.collection('patients');
        const queries = input

        const context = []; //stores context for ai

        //iterate through all the names to read
        for (let i=0; i<queries.length; i++){
            const query = {name: queries[i]};
            const info_raw = await collection.findOne(query);
            const info = JSON.stringify(info_raw);
            if (info_raw){
                context.push(info);
            }
            else{
                context.push(`No data for patient ${queries[i]} `);
            }
        }
        
        console.log(`Here is the query: ${context.toString()}`);

        let new_prompt = prompt + `, given the context: <<<${context.toString()}>>>. You are a Nurse AI, be professional and get to the point concisely. Only use the given context for your response.`;
        const completion2 = await openai.chat.completions.create({
            messages: [{ role: "system", content: new_prompt }],
            model: "gpt-4o"
          });
        console.log(`\nHere is the response:\n ${completion2.choices[0]["message"]["content"]}`)
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
}

export async function CREATE() {
    
    const uri = "mongodb://localhost:27017";
    
    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected successfully to server");

        // Specify the database and collection
        const database = client.db('test');
        const collection = database.collection('patients');

    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
}

export async function UPDATE(input) {
    const uri = "mongodb://localhost:27017";
    
    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected successfully to server");

        // Specify the database and collection
        const database = client.db('test');
        const collection = database.collection('patients');

        for (let i = 0; i<input.length; i++){
            const person = input[i];
                // Extract the key and the nested object
            const outerKey = Object.keys(person)[0];
            const innerObject = person[outerKey];

            // Build the filter and update objects
            const filter = { [outerKey]: { $exists: true } };
            const updateDoc = {
            $set: {}
            };
            
            for (const [key, value] of Object.entries(innerObject)) {
            updateDoc.$set[`${outerKey}.${key}`] = value;
            }

            // Update the document
            const result = await collection.updateOne(filter, updateDoc);
            console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
    
}
  

export async function DELETE(prompt, input) {
    // assumes input in the form {READ: [names]}
    const uri = "mongodb://localhost:27017";
    
    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected successfully to server");

        // Specify the database and collection
        const database = client.db('test');
        const collection = database.collection('patients');
        const queries = input

        const context = []; //stores context for ai

        //iterate through all the names to read
        for (let i=0; i<queries.length; i++){
            const query = {name: queries[i]};
            const info_raw = await collection.findOne(query);
            const info = JSON.stringify(info_raw);
            if (info_raw){
                context.push(`Deleted patient ${queries[i]}`);
                collection.deleteOne(query)
            }
            else{

                context.push(`Could not find patient ${queries[i]} `);
            }
        }
        
        console.log(`Here is the query: ${context.toString()}`);

        let new_prompt = prompt + `, given the context: <<<${context.toString()}>>>, in a short summary mention the deletions/no deletions if any`;
        const completion2 = await openai.chat.completions.create({
            messages: [{ role: "system", content: new_prompt }],
            model: "gpt-4o"
          });
        console.log(`\nHere is the response:\n ${completion2.choices[0]["message"]["content"]}`)
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
}
//   module.exports = {
//     CREATE,
//     READ,
//     UPDATE,
//     DELETE
//   };
  