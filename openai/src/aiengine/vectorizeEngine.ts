import { NextFunction, Request, Response } from "express";
import {
    deleteFile,
    loadDocument,
    splitDocumentToTextChunks,
    vectorizeTextChunks,
} from "./utils";

import { fileName } from "../middleware/record/handlePatientRecordFile";

// def some constants for the vectorization process
const chunkSize = 1000;
const chunkOverlap = 200;
const dbName = process.env.VECTOR_DB_NAME as string;

const collectionName = "testVector";

// def a function for vectorization
export const vectorizeEngine = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const doc = await loadDocument();

        const patientDetails = {
            patientId: req.body.patientId,
            patientName: req.body.patientName,
        };

        const textChunks = await splitDocumentToTextChunks(
            doc,
            chunkSize,
            chunkOverlap,
            patientDetails
        );

        await vectorizeTextChunks(textChunks, dbName, collectionName);

        const filePath = `./tmp/patientFiles/${fileName}`;
        deleteFile(filePath);

        next();
    } catch (error) {
        console.log("Error in addCurrentBookInfo: ", error); // log the error for debugging purposes in the backend
        res.status(500).json({ message: "Internal server error" }); // don't give too much information to the client side
    }
};
