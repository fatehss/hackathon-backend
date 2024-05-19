import express from "express";
import { vectorizeEngine } from "../../aiengine/vectorizeEngine";
import patientController from "./patientController";
import { handlePatientRecordFile } from "../../middleware/record/handlePatientRecordFile";

const router = express.Router();

router.post(
    "/",
    handlePatientRecordFile,
    vectorizeEngine,
    patientController.addCurrentPatientInfo
);

export default router;
