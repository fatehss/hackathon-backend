import { Request, Response } from "express";
import OpenAI from "openai";

import { vectorSearch } from "./utils";
import { ChatCompletionMessage } from "openai/resources";

// housekeeping
const dbName = process.env.VECTOR_DB_NAME as string;
const openai = new OpenAI();

export const aiChatwithVectorSearchEngine = async (
    req: Request,
    res: Response
) => {
    try {
        const contextContent = await vectorSearch(
            dbName,
            `${req.body.auth0Id + "-" + req.body.category}`,
            req.body.searchQuery,
            false
        );

        const searchQuery = JSON.stringify(req.body.searchQuery);

        const messages: ChatCompletionMessage[] = [
            {
                role: "assistant",
                content: `Given context: "${contextContent}."`,
            },
        ];

        const response = await openai.chat.completions.create({
            messages: [
                ...messages,
                {
                    role: "user",
                    content: searchQuery,
                },
            ],
            model: "gpt-3.5-turbo",
            // stream: true,
        });

        console.log("response: ", response.choices[0].message.content);

        res.status(200).json({ message: response.choices[0].message.content });
    } catch (error) {
        console.log("Error in searchEngine: ", error); // log the error for debugging purposes in the backend
        res.status(500).json({ message: "Internal server error" }); // don't give too much information to the client side
    }
};
