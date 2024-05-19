import e, { Request, Response } from "express";
import { aiChatwithVectorSearchEngine, vectorSearch } from "./utils";
// import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { negativeOrPositive, performCrudOperations } from "./openai";

import { OpenAI } from "openai";
export const openai = new OpenAI();

const dbName = process.env.VECTOR_DB_NAME as string;
const collectionName = "testVector";

export const aiChatEngine = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.body.query;
        // const searchQuery = "delete John Doe from the database";
        // const patientId = req.body.patientId;
        const patientId = "id1";


        const stringResponse = await performCrudOperations(searchQuery);

        console.log("String Response Attempt Fateh")
        console.log("stringResponse: ", stringResponse);   

        const posOrNeg = await negativeOrPositive(stringResponse);

        if (posOrNeg.result) {

            console.log("fateh")
            res.json({ message: stringResponse });

        } else {
            console.log("hoang")
            const responseChat = await aiChatwithVectorSearchEngine(
                dbName,
                collectionName,
                searchQuery,
                patientId
            );

            res.json({ message: responseChat });
        }


       

        // const stringResponse = await performCrudOperations(searchQuery);

        // console.log("stringResponse: ", stringResponse);

        // res.json({ message: stringResponse });

        // const searchQuery = req.body.query;
        // const patientId = req.body.patientId;
        // const patientId = "id1";

        // const context = await vectorSearch(
        //     dbName,
        //     collectionName,
        //     patientId,
        //     searchQuery
        // );

        // const messages: ChatCompletionMessageParam[] = [
        //     {
        //         role: "system",
        //         content:
        //             "You are a Nurse AI, be professional and get to the point concisely. Only use the given context for your response",
        //     },

        //     {
        //         role: "assistant",
        //         content: `Given context: "${context}."`,
        //     },

        //     {
        //         role: "user",
        //         content: searchQuery,
        //     },
        // ];

        // const response = await openai.chat.completions.create({
        //     messages: messages,
        //     model: "gpt-4o",
        // });

        // res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.log("Error in aiChatwithVectorSearchEngine: ", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error" });
        } else {
            res.end();
        }
    }
};
