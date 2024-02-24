import { XIcon } from "lucide-react";
import React from "react";

interface TabProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

const Tab: React.FC<TabProps> = ({ title, isActive, onClick, onClose }) => {
  return (
    <div
      className={`pr-2 pl-4 cursor-pointer flex justify-center items-center border-r border-r-gray-200 ${
        isActive ? "bg-gray-200" : ""
      }`}
      onClick={onClick}
    >
      <p className="text-center">{title}</p>
      <span className="ml-2 size-5 group" onClick={(e) => e.stopPropagation()}>
        <button className="" onClick={onClose}>
          <XIcon className="size-4 group-hover:bg-gray-300 p-0.5 rounded-full" />
        </button>
      </span>
    </div>
  );
};

export default Tab;
