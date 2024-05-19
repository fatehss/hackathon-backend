import { ArrowPathIcon, ChatBubbleBottomCenterIcon, HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ReactElement } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
export default function MainPage() {
	interface Link {
		label: string;
		to: string;
		icon: ReactElement;
	}

	const links: Link[] = [
		{
			label: "Home",
			to: "/",
			icon: <HomeIcon className="size-7"></HomeIcon>,
		},
		{
			label: "Chat",
			to: "/info",
			icon: <InformationCircleIcon className="size-7"></InformationCircleIcon>,
		},
	];


	return (
		<>
			<div className="flex bg-slate-100 min-h-screen">
				<div id="sidebar-main" className="flex flex-col w-20 bg-white items-center space-y-4">


					<div className="flex items-center justify-center text-center h-20 w-full">
						<ArrowPathIcon className="size-9"></ArrowPathIcon>
					</div>
					{links.map((link, i) => (
						<NavLink key={i} className="border-black rounded-lg p-2" id={link.label} to={link.to}>
							{link.icon}
						</NavLink>
					))}
				</div>
				<div className="w-full">
					<Outlet></Outlet>
				</div>
			</div>
		</>
	);
}
