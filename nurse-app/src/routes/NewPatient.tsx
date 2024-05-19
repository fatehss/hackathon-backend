import { ArrowRightEndOnRectangleIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function NewPatient() {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex items-center text-xl h-20 p-3">
				New Patient
			</div>

			<div className="flex items-center justify-center">
				<form className="flex flex-col space-y-4 w-[900px] bg-white p-4 rounded-lg" action="">
					<div className="flex space-x-5">
						<div className="flex flex-col w-1/2">
							<label>Name</label>
							<input className="bg-gray-100 rounded-md text-md p-1.5" type="text" />
						</div>

						<div className="flex flex-col w-1/2">
							<label>Medical Document Number</label>
							<input className="bg-gray-100 rounded-md text-md p-1.5" type="text" />
						</div>
					</div>

					<div className="flex space-x-5">
						<div className="flex flex-col w-1/2">
							<label>Sex</label>
							<select className="bg-gray-100 rounded-md text-md p-1.5">
								<option value="">Select</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>

						<div className="flex flex-col w-1/2">
							<label>Date of Birth</label>
							<input className="bg-gray-100 rounded-md text-md p-1.5" type="date" />
						</div>
					</div>

					<div className="flex flex-col">
						<label>Extra Notes</label>
						<textarea className="bg-gray-100 rounded-md text-md p-1.5" />
					</div>

					<div className="flex">
						<button className="bg-black text-white text-sm w-40 rounded-md p-2 flex items-center space-x-2 font-medium justify-center">
							<PlusIcon className="size-4" />
							<span>Create</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
