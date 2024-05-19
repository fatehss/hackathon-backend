import mongoose from "mongoose";

// def a schema for the user
const PatientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
});

// create a model for the user
const Patient = mongoose.model("Patient", PatientSchema);

// export the model
export default Patient;
