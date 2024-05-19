import { Request, Response } from "express";
import "dotenv/config";
import Patient from "../../models/patient";

const addCurrentPatientInfo = async (req: Request, res: Response) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();

        res.status(201).json(newPatient.toObject());
    } catch (error) {
        console.log("Error in addCurrentBook: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

export default {
    addCurrentPatientInfo,
};
