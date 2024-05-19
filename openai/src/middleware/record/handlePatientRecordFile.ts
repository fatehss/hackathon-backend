import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";
let fileName: string;

// make a middleware to handle the file sent from the frontend
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(".", "tmp", "patientFiles");
        fs.mkdir(dest, { recursive: true }, (err) => {
            // Ensure the directory exists
            if (err) throw err;
            // cb(null, dest);
            cb(null, path.join(".", "tmp", "patientFiles"));
        });
    },

    filename: function (req, file, cb) {
        fileName = uuidv4() + "-" + file.originalname;
        cb(null, fileName);
    },
});

export { fileName };

export const handlePatientRecordFile = multer({ storage: storage }).single(
    "file"
);
