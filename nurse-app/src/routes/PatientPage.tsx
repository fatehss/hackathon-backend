// PatientPage.tsx

import { PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import AddRecordModal from "../components/NewRecordComponent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PatientPage() {

    const [patient, setPatient] = useState({});
    const [data, setData] = React.useState<RowSelector[]>([]);
    const {id} = useParams();

    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, []);


    const fetchData = async () => {
        try {
            // Replace 'YOUR_API_URL' with your actual API endpoint
            const response = await axios.get(`http://localhost:3030/patient/${id}`);
            if (response.data) {
                console.log(response.data)
                setPatient(response.data);
                setData(response.data.records)
            } // Set the fetched data to state
        } catch (error) {
            setData([])
            console.error("Error fetching data:", error);
        }
    };


 // find by id 
  interface RowSelector {
    id: string;
    date: string;
    weight: Float64Array;
    systolic_blood_pressure: number;
    diastolic_blood_pressure: number;
    cholesterol: string;
    glocus: string;
  }

  const columns = [
    {
      name: "Date",
      selector: (row: RowSelector) => row.date,
    },
    {
      name: "Weight",
      selector: (row: RowSelector) => row.weight, 
    },
    {
      name: "Systolic Blood Pressure",
      selector: (row: RowSelector) => row.systolic_blood_pressure,
    },
    {
      name: "Diastolic Blood Pressure",
      selector: (row: RowSelector) => row.diastolic_blood_pressure,
    },
    {
      name: "Glucose",
      selector: (row: RowSelector) => row.glocus,
    },
    {
      name: "Cholesterol",
      selector: (row: RowSelector) => row.cholesterol,
    },
  ];


  const dates = data.map((entry) => entry.date);
  const sysBloodPressureData = data.map((entry) => entry.systolic_blood_pressure)
  const diaBloodPressureData = data.map((entry) => entry.diastolic_blood_pressure);
  const glucoseData = data.map((entry) =>
    entry.glocus === "High" ? 2 : entry.glocus === "Borderline" ? 1 : 0
  ); // Encoded as 2: High, 1: Borderline, 0: Normal
  const cholesterolData = data.map((entry) =>
    entry.cholesterol === "High"
      ? 2
      : entry.cholesterol === "Borderline"
      ? 1
      : 0
  ); // Encoded as 2: High, 1: Borderline, 0: Normal

  const chartData = (label: string, data: number[], color: string) => ({
    labels: dates,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      },
    ],
  });

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleAddRecord = (newRecord: RowSelector) => {
    setData([...data, newRecord]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AddRecordModal isOpen={modalIsOpen} onRequestClose={closeModal} onSubmit={handleAddRecord} />
      <div className="flex items-center h-20 p-3 justify-between bg-white">
        <h1 className="text-2xl font-semibold text-indigo-500">{patient.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={openModal}
            className="bg-black text-white text-sm w-40 rounded-md px-2 py-2.5 flex items-center space-x-2 font-medium justify-center"
          >
            <PlusIcon className="size-4"></PlusIcon>
            <span>New Record</span>
          </button>
          <button className="bg-red-700 text-white text-sm w-40 rounded-md px-2 py-2.5 flex items-center space-x-2 font-medium justify-center">
            <span>Delete Patient</span>
          </button>
        </div>
      </div>

      {/* <div className="p-5">
        <div className="border-2 p-2 border-red-500 rounded-md text-center">
          Based on the history of {patient.name}. He's in risk of a cardiovascular disease.
        </div>
      </div> */}

      <div className="p-3 flex space-x-2 justify-center">
        <div className="w-full md:w-5/12 p-2 bg-white rounded-md">
          <h2 className="text-lg mb-3">Systolic Blood Pressure</h2>
          <Line
            data={chartData(
              "Systolic Blood Pressure",
              sysBloodPressureData,
              "rgba(75,192,192,1)"
            )}
          />
        </div>
        <div className="w-full md:w-5/12 p-2 bg-white rounded-md">
          <h2 className="text-lg mb-3">Diastolic Blood Pressure</h2>
          <Line
            data={chartData(
              "Diastolic Blood Pressure",
              diaBloodPressureData,
              "rgba(153,102,255,1)"
            )}
          />
        </div>
        {/* <div className="w-full md:w-1/2 p-2 bg-white rounded-md">
          <h2 className="text-lg mb-3">Glucose Levels</h2>
          <Line
            data={chartData(
              "Glucose Levels",
              glucoseData,
              "rgba(255,159,64,1)"
            )}
          />
        </div>
        <div className="w-full md:w-1/2 p-2 bg-white rounded-md">
          <h2 className="text-lg mb-3">Cholesterol Levels</h2>
          <Line
            data={chartData(
              "Cholesterol Levels",
              cholesterolData,
              "rgba(255,99,132,1)"
            )}
          />
        </div> */}
      </div>

      <div className="p-3">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
