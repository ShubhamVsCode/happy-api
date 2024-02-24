"use client";

import Tab from "./tab";
import { useCallback, useEffect } from "react";
import { Request } from "@prisma/client";
import { useRequestsStore } from "@/store/requests";

const Tabs = () => {
  const { requests, closeRequest, activeRequest, setActiveRequest } =
    useRequestsStore();

  const handleTabClick = (request: Request) => {
    setActiveRequest(request);
  };

  const handleCloseTab = useCallback(
    (request: Request) => {
      closeRequest(request);
    },
    [closeRequest],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check for Ctrl key (Cmd key on macOS)
      const isCtrlKey = e.ctrlKey || e.metaKey;

      // Handle Ctrl + W to close the current tab
      if (isCtrlKey && e.key === "e") {
        e.preventDefault(); // Prevent the browser's default behavior
        console.log("Ctrl + W pressed");
        if (activeRequest) handleCloseTab(activeRequest);
      }

      // Handle Ctrl + Tab to switch to the next tab
      if (isCtrlKey && e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        switchToNextTab();
      }

      // Handle Ctrl + Shift + Tab to switch to the previous tab
      if (isCtrlKey && e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        switchToPreviousTab();
      }
    },
    [activeRequest, handleCloseTab],
  );
  const switchToNextTab = () => {
    console.log("Switching to the next tab");
  };

  const switchToPreviousTab = () => {
    console.log("Switching to the previous tab");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex">
      {requests.map((req, index) => (
        <Tab
          key={index}
          title={req.name}
          isActive={req.id === activeRequest?.id}
          onClick={() => handleTabClick(req)}
          onClose={() => handleCloseTab(req)}
        />
      ))}
    </div>
  );
};

export default Tabs;
