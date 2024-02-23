// Tabs.tsx
import React, { useState } from "react";
import Tab from "./tab";
import { Request } from "@prisma/client";

interface TabsProps {
  tabs: Request[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleCloseTab = (index: number) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    setActiveTab(Math.min(activeTab, newTabs.length - 1));
  };

  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          title={tab.name}
          isActive={index === activeTab}
          onClick={() => handleTabClick(index)}
          onClose={() => handleCloseTab(index)}
        />
      ))}
    </div>
  );
};

export default Tabs;
