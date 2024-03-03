"use client";

import Tab from "./tab";
import { useCallback, useEffect, useState } from "react";
import { Request } from "@prisma/client";
import { useRequestsStore } from "@/store";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const RequestTabs = () => {
  const {
    requests,
    closeRequest,
    activeRequest,
    setActiveRequest,
    goToNextRequest,
  } = useRequestsStore();
  const [isScrolling, setIsScrolling] = useState(false);

  const handleTabClick = (request: Request) => {
    if (activeRequest?.id === request.id) return;
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
    <ScrollArea
      className="flex-1 [&_>div>div]:h-full"
      onMouseEnter={() => setIsScrolling(true)}
      onMouseLeave={() => setIsScrolling(false)}
    >
      <ScrollBar orientation="horizontal" />
      <div className="flex items-stretch h-full">
        {requests.map((req, index) => (
          <Tab
            key={req.id}
            title={req.name}
            isActive={req.id === activeRequest?.id}
            onClick={() => handleTabClick(req)}
            onClose={() => closeRequest(req)}
            isScrolling={isScrolling}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default RequestTabs;
