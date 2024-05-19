import { ChatBubbleBottomCenterIcon, UsersIcon } from "@heroicons/react/24/outline";
import { ReactElement } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";



export default function HomePage() {

    interface Link {
		label: string;
		to: string;
        icon: ReactElement
	}

	const links: Link[] = [
        {
			label: "Patients List",
			to: "/patients",
            icon: <UsersIcon className="size-5"></UsersIcon>
		},
        {
			label: "AI Agent",
			to: "/chat",
            icon: <ChatBubbleBottomCenterIcon className="size-5"></ChatBubbleBottomCenterIcon>
		},
	];
	return (
		<div className="flex">
			<div className="flex flex-col w-80 min-h-screen bg-white border-gray-200 border-x-[1px]">
				<div className="flex items-center  h-20  border-b-[1px] border-gray-200">
					<div className="text-center text-gray-500 w-full">
						Patients Dashboard
					</div>
				</div>


                <div id="home-sidebar" className="flex flex-col w-full bg-white  space-y-2 pt-5 px-3">
					{links.map((link, i) => (
						<NavLink key={i} className="flex flex-row items-center space-x-2 w-full rounded-md p-2" id={link.label} to={link.to}>
							{link.icon}
                            <span className="text-md">{link.label}</span>
						</NavLink>
					))}
				</div>
			</div>

            <div className="w-full">
                <Outlet></Outlet>
            </div>

         
      


		</div>
	);
}
