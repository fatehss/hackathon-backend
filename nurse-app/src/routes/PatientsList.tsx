import {
    ArrowRightEndOnRectangleIcon,
    PlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

export default function PatientsList() {

    const [data, setData] = useState([])

    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, []);

    const fetchData = async () => {
        try {
            // Replace 'YOUR_API_URL' with your actual API endpoint
            const response = await axios.get('http://localhost:3030/patients');
            if (response.data) {
                console.log(response.data)
                setData(response.data);
            } // Set the fetched data to state
        } catch (error) {
            setData([])
            console.error("Error fetching data:", error);
        }
    };


	const OpenButton = ({id}) => (
		<div className="flex space-x-4">
			<Link
				className="rounded-md text-center font-medium"
				to={`/patients/${id}`}>
				<ArrowRightEndOnRectangleIcon className="size-6"></ArrowRightEndOnRectangleIcon>
			</Link>
            <button>
                <TrashIcon className="size-5 text-red-500"></TrashIcon>
            </button>
		</div>
	);
	interface RowSelector {
		id: string;
		name: string;
		birthDate: string;
	}

	const columns = [
		{
			name: "ID",
			selector: (row: RowSelector) => row.medical_document_id,
		},
		{
			name: "Name",
			selector: (row: RowSelector) => row.name,
		},
		{
			name: "Birth Date",
			selector: (row: RowSelector) => row.date_of_birth,
		},
		{
			name: "Action",
			cell: (row: RowSelector) => <OpenButton id={row._id}></OpenButton>,
		},
	];

	

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex items-center h-20 p-3 justify-between">
				<h1 className="text-xl">Patients List</h1>
				<Link to="/new" className="bg-black text-white text-sm w-40 rounded-md px-2 py-2.5 flex items-center space-x-2 font-medium justify-center">
					<PlusIcon className="size-4"></PlusIcon>

					<span>New Patient</span>
				</Link>
			</div>

			<div className="p-3">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	);
}
