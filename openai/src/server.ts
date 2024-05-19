import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import patientRoute from "./routes/patient/patientRoute";
import aiChatRoute from "./routes/aiChat/aiChatRoute";
import { negativeOrPositive } from "./aiengine/openai";

// Load environment variables from the .env file
const MONGODB_URL = process.env.MONGODB_CONNECTION_STRING as string;
const PORT = 8000;

const FRONTEND_URL_DEV = process.env.FRONTEND_URL_DEV as string;
const FRONTEND_URL_PRO = process.env.FRONTEND_URL_PRO as string;

// Connect to MongoDB
mongoose.connect(MONGODB_URL);

// Check if MongoDB is connected
export const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Connected to MongoDB");
});

// Create a new express application instance
const app = express();

app.use(
    cors(
        // add the origin and credentials options here to talk to the frontend
        {
            // origin: [FRONTEND_URL_PRO, FRONTEND_URL_DEV],
            origin: "*",
            credentials: true,
        }
    )
); // for enabling CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make a test endpoint
app.get("/", async (req: Request, res: Response) => {
    res.json({ message: "Health check passed" });
});

// negativeOrPositive("There is no available data for a patient named Mohammed. Please provide more information or check the records for accuracy.")

app.use("/records", patientRoute);
app.use("/aichat", aiChatRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
