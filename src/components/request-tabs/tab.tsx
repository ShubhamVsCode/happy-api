import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface TabProps {
  title: string;
  isActive: boolean;
  isScrolling: boolean;
  onClick: () => void;
  onClose: () => void;
}

const Tab: React.FC<TabProps> = ({
  title,
  isActive,
  onClick,
  onClose,
  isScrolling,
}) => {
  const { inView, ref, entry } = useInView({
    // triggerOnce: true,
    // fallbackInView: true,
    threshold: 1,
  });

  useEffect(() => {
    if (isActive && !inView) {
      if (isScrolling) return;
      entry?.target?.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [entry?.target, inView, isActive, isScrolling]);

  return (
    <div
      className={`pr-2 pl-4 cursor-pointer flex justify-center items-center shrink-0 border-r border-r-gray-200 ${
        isActive ? "bg-gray-200" : ""
      }`}
      onClick={onClick}
      ref={ref}
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
