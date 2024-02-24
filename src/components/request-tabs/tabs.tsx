"use client";

import Tab from "./tab";
import { useCallback, useEffect } from "react";
import { Request } from "@prisma/client";
import { useRequestsStore } from "@/store/requests";

const Tabs = () => {
  const {
    requests,
    closeRequest,
    activeRequest,
    setActiveRequest,
    goToNextRequest,
  } = useRequestsStore();

  const handleTabClick = (request: Request) => {
    setActiveRequest(request);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check for Ctrl key (Cmd key on macOS)
      const isCtrlKey = e.ctrlKey || e.metaKey;

      // Handle Ctrl + e to close the current tab
      if (isCtrlKey && e.key === "e") {
        e.preventDefault();
        if (activeRequest) closeRequest(activeRequest);
      }

      // Handle Ctrl + ArrowRight to switch to the next tab
      if (isCtrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        goToNextRequest(true);
      }

      // Handle Ctrl + ArrowLeft to switch to the previous tab
      if (isCtrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goToNextRequest(false);
      }
    },
    [activeRequest, goToNextRequest, closeRequest],
  );

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
          onClose={() => closeRequest(req)}
        />
      ))}
    </div>
  );
};

export default Tabs;
