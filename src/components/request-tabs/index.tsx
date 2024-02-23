"use client";

import { useState } from "react";
import Tabs from "./tabs";
import { useRequestsStore } from "@/store/requests";

const RequestTabs = () => {
  const { requests, addRequest, setRequests } = useRequestsStore();

  return (
    <div className="flex w-full justify-between items-end">
      <nav className="flex gap-4">
        <Tabs tabs={requests} />
      </nav>
      {/* <div className="p-4">{tabs[activeTab].content}</div> */}
    </div>
  );
};

export default RequestTabs;
