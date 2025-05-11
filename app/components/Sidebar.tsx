/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  const pathname = usePathname(); // Get the current route

  const isActive = (path: string) => pathname.startsWith(path);

  console.log(pathname);

  const navLinks = [
    {
      label: "Trainings",
      path: "/trainings",
      icon: "/icons/training.svg",
    },
    {
      label: "Personnels",
      path: "/personnels",
      icon: "/icons/personnel.svg",
    },
  ];

  return (
    <div className={`border-r-2 left-0 h-full bg-[#F4F4F4] transition-all duration-300 ${isExpanded ? "w-[256px]" : "w-[64px]"}`}>
      <nav className={`flex flex-col gap-2 mt-10 ${isExpanded && "px-4"}`}>
        {/* {isExpanded && <p className='font-poppinsBold mb-4 text-[#666666] text-[14px]'>— MANAGE</p>} */}

        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex items-center gap-4  ${!isExpanded && "px-2 py-2 m-auto justify-center"} ${isExpanded && "px-4 py-2 m-1 justify-start"} transition-colors rounded-lg ${isActive(link.path) ? "bg-primaryButton text-white" : "hover:bg-gray-300 text-[#666666]"}`}>
            <Image
              className={`transition-transform ${isActive(link.path) ? "filter invert brightness-0" : ""}`}
              src={link.icon}
              alt={`${link.label} Icon`}
              width={25}
              height={25}
            />
            {isExpanded && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
