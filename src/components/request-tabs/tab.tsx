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
      className={`p-2 cursor-pointer border-t border-l border-r rounded-t-lg ${
        isActive ? "bg-gray-200" : ""
      }`}
      onClick={onClick}
    >
      {title}
      {isActive && (
        <span className="ml-2" onClick={(e) => e.stopPropagation()}>
          <button className="text-red-500" onClick={onClose}>
            &times;
          </button>
        </span>
      )}
    </div>
  );
};

export default Tab;
