import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import Modal from "react-modal";

interface AddRecordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (newRecord: any) => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [notes, setNotes] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newRecord = {
      id: String(Date.now()),
      date: formData.get("date") as string,
      weight: new Float64Array([parseFloat(formData.get("weight") as string)]),
      sysBloodPressure: parseInt(formData.get("sysBloodPressure") as string, 10),
      diaBloodPressure: parseInt(formData.get("diaBloodPressure") as string, 10),
      cholesterol: formData.get("cholesterol") as string,
      glucos: formData.get("glucos") as string,
      notes: notes,
      file: file,
    };
    onSubmit(newRecord);
    onRequestClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Record Modal" className=" fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <form className="flex flex-col space-y-4 bg-white p-4 rounded-lg" onSubmit={handleSubmit}>
        <div className="flex space-x-5">
          <div className="flex flex-col w-1/2">
            <label>Date</label>
            <input name="date" className="bg-gray-100 rounded-md text-md p-1.5" type="date" required />
          </div>
          <div className="flex flex-col w-1/2">
            <label>Weight</label>
            <input name="weight" className="bg-gray-100 rounded-md text-md p-1.5" type="number" step="0.1" required />
          </div>
        </div>
        <div className="flex space-x-5">
          <div className="flex flex-col w-1/2">
            <label>Systolic Blood Pressure</label>
            <input name="sysBloodPressure" className="bg-gray-100 rounded-md text-md p-1.5" type="number" required />
          </div>
          <div className="flex flex-col w-1/2">
            <label>Diastolic Blood Pressure</label>
            <input name="diaBloodPressure" className="bg-gray-100 rounded-md text-md p-1.5" type="number" required />
          </div>
        </div>
        <div className="flex space-x-5">
          <div className="flex flex-col w-1/2">
            <label>Cholesterol</label>
            <select name="cholesterol" className="bg-gray-100 rounded-md text-md p-1.5" required>
              <option value="Normal">Normal</option>
              <option value="Borderline">Borderline</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2">
            <label>Glucose</label>
            <select name="glucos" className="bg-gray-100 rounded-md text-md p-1.5" required>
              <option value="Normal">Normal</option>
              <option value="Borderline">Borderline</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        {/* Doctor Notes */}
        <div className="flex flex-col">
          <label>Doctor Notes</label>
        </div>

        {/* Upload File */}
        <div className="flex flex-col">
          <label>Upload Text or PDF File</label>
          <input
            type="file"
            accept=".pdf .txt"
            onChange={handleFileChange}
            className="bg-gray-100 rounded-md text-md p-1.5"
          />
        </div>

        <div className="flex space-x-2">
          <button
            className="bg-gray-400 text-sm rounded-md p-2 flex items-center space-x-2 font-medium justify-center"
            onClick={onRequestClose}
          >
            <span>Cancel</span>
          </button>
          <button
            className="bg-black text-white text-sm w-40 rounded-md p-2 flex items-center space-x-2 font-medium justify-center"
            type="submit"
          >
            <PlusIcon className="size-4" />
            <span>Add Record</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecordModal;
