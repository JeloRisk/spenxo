"use client";

import { useState } from "react";
import Image from "next/image";

interface NavigationProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isExpanded, toggleSidebar }) => {
  return (
    // px-4 sm:px-6 md:px-20 navbar
    <nav
      className="fixed top-0 left-0 right-0  bg-primaryColor border-b border-b-gray-400  flex justify-start items-center z-20 h-[60px]">
      {/* {isExpanded && <h1 className='text-xl font-bold text-white'>INPPO</h1>} */}
      <div className="flex w-16 justifify-center">
        <div className="flex items-center px-2 py-2 m-auto">
          <button
            onClick={toggleSidebar}
            className="text-white">
            <Image
              className="transition-transform filter invert"
              src="/icons/menu.svg"
              alt="Menu Icon"
              width={25}
              height={25}
            />
          </button>
        </div>
      </div>
      <span className="text-2xl font-poppinsBold">PoLists</span>
    </nav>
  );
};

export default Navigation;
