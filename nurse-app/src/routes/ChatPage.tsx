import axios from "axios";
import Markdown from 'https://esm.sh/react-markdown@9';
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

export default function ChatPage() {
	const [messages, setMessages] = useState([
		{
			message: "Hello, how can I help you today?",
			direction: 1,
		},
		
	]);

	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	const addMessage = async () => {
		if (input.trim() !== "") {
			const newMessages = [...messages, { message: input, direction: 1 }];
			setMessages(newMessages);
			setInput("");
            setIsTyping(true);

            try {
                const res = await axios.post("http://localhost:8000/aichat", {
                    query: input
                })

                if (res) {

                    fakeTypingEffect(res.data.message)
                    
                }
            } catch (error) {
                console.log("error")
            }

			// Fake bot response with typing effect
			// setTimeout(() => {
			// 	fakeTypingEffect("Hello This is a fake response from the bot.");
			// }, 1000);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			addMessage();
		}
	};

	const fakeTypingEffect = (fullMessage) => {
        
		let index = 0;
		const typingSpeed = 50; // Adjust typing speed here

		const typingInterval = setInterval(() => {
			setMessages((prevMessages) => {
				const lastMessage = prevMessages[prevMessages.length - 1];
				if (
					lastMessage &&
					lastMessage.direction === 0 &&
					lastMessage.isTyping
				) {
					// Update the last typing message
					const updatedMessages = [...prevMessages];
					updatedMessages[updatedMessages.length - 1].message =
						fullMessage.slice(0, index + 1);
					index += 1;

					// If message is fully typed, stop the interval and set isTyping to false
					if (index === fullMessage.length) {
						clearInterval(typingInterval);
						updatedMessages[updatedMessages.length - 1].isTyping =
							false;
						setIsTyping(false);
					}
					return updatedMessages;
				} else {
                    console.log('hi')
					// Add a new typing message
					return [
						...prevMessages,
						{
							message: "Do you need anything else?",
							direction: 0,
							isTyping: true,
						},
					];
				}
			});
		}, typingSpeed);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow-md p-4">
				<h1 className="text-2xl font-semibold">MediSync Agent</h1>
			</header>

			{/* Chat Area */}
			<main className="flex-1 overflow-y-auto p-4">
				<div className="space-y-4">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`p-4 rounded-lg shadow ${
								msg.direction === 0
									? "self-start bg-slate-100 rounded-full rounded-bl-none"
									: "self-end bg-white rounded-full rounded-br-none"
							}`}
						>
                            <Markdown>
                            {msg.message}
                            </Markdown>
							
						</div>
					))}
					
				</div>
			</main>

			{/* Input Area */}
			<footer className="bg-white shadow-md p-4 flex items-center">
				{isTyping ? (
					"typing..."
				) : (
					<>
						<input
							type="text"
							placeholder="Type your message..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							className="flex-grow border border-gray-300 rounded-lg p-2 mr-4"
						/>
						<button
							onClick={addMessage}
							className="bg-black text-white rounded-lg px-4 py-2 hover:bg-blue-600"
						>
							Send
						</button>
					</>
				)}
			</footer>
		</div>
	);
}
