import { MongoClient } from 'mongodb';

async function main() {
    // Connection URL
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

        // Create a document to insert
        const doc = { name: "John Doe", height: 180, medical_conditions: ["Hypertension"], age: 40, city: "New York", occupation: "Engineer" };

        // Insert the document
        // const result = await collection.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
}

main().catch(console.error);
