import React from "react";
import Markdown from "react-markdown";

export default function InfoPage() {
	return (

        <>

        <div className="flex bg-white h-20 items-center px-3">
				<h1 className="text-2xl font-semibold text-indigo-500">
					MediSync AI
				</h1>
			</div>
		<div className="p-4">
			

			<h2 className="text-xl mt-5 font-semibold">Problem:</h2>
			<p className="text-xl">
				Medical professionals with no technical background have
				difficulty interacting with large medical databases. They often
				require some technical expertise to query large databases or
				intensive training on the traditional old EHR systems.
			</p>

			<h2 className="text-xl mt-5 font-semibold">Solution:</h2>
			<p className="text-xl">
				We enable medical professionals with no technical background to
				easily interact with large medical databases and help them
				analyze and visual patient history thought NLP and vector
				databases. We give them the ability to query and interact with
				their database by chatting with MediSync agent. They can update
				medical records or summarize a patients general health throught
				chatting. We also added visualization general health vitals
				metrics that was collected through interacting with MediSync.
			</p>

			<h2 className="text-xl mt-5 font-semibold">Current Solution:</h2>
			<div className="flex flex-col space-y-1">
				<p className="text-xl">
					- Currently, health professionals needs to communicate with
					technical professionals in order to deal with their big
					health data.
				</p>
				<p className="text-xl">
					- They also use complicated tools that requires intensive
					training before using them to book keep their patient
					records such as Cerner or Epic.
				</p>
				<p className="text-xl">
					- They even need more technical experience to be able to
					easily visualize their data.
				</p>
			</div>

			<div className="flex flex-col space-y-1 mt-10">
				<p className="text-xl">
					- I did a checkup on Mohammed Balfaqih. His blood pressure
					is 120/90 and his general health looks stable. No complaints
					from patient. Can you add that to the records?
				</p>
				<p className="text-xl">
					- Can you tell me how Mohammed Balfaqih's health been
					lately?
				</p>
				<p className="text-xl">
					- When was the last time Mohammed Balfaqih had a doctor note
					about his diabetes.
				</p>
			</div>
		</div>
        </>
	);
}
