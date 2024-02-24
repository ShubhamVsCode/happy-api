"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { RequestMethod as Method, Request } from "@prisma/client";
import { useRequestsStore } from "@/store/requests";
import useEditableText from "@/hooks/useEditableText";
import { Input } from "../ui/input";
import { updateRequest } from "@/actions/request";

const methodColors = {
  [Method.GET]: "text-green-500",
  [Method.POST]: "text-yellow-500",
  [Method.PUT]: "text-blue-500",
  [Method.PATCH]: "text-purple-500",
  [Method.DELETE]: "text-red-500",
};

const methodBgColors = {
  [Method.GET]: "bg-green-100",
  [Method.POST]: "bg-yellow-100",
  [Method.PUT]: "bg-blue-100",
  [Method.PATCH]: "bg-purple-100",
  [Method.DELETE]: "bg-red-100",
};

const RequestButton = ({ request }: { request: Request }) => {
  const { setActiveRequest, addUpdatedRequest } = useRequestsStore();
  const [updatedRequest, setUpdatedRequest] = useState<Request>(request);

  const onDoubleClick = () => {};
  const onBlur = async () => {
    if (request.name == text) return;
    const updatedReq = await updateRequest({ id: request.id, name: text });
    addUpdatedRequest(updatedReq);
    setUpdatedRequest(updatedReq);
  };

  const {
    isEditing,
    text,
    textRef,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    setText,
  } = useEditableText({
    initialValue: updatedRequest.name ?? request.name,
    onDoubleClick,
    onBlur,
  });

  return (
    <Button
      className={`w-full text-left items-center justify-start grid grid-cols-[50px_1fr] pl-2`}
      size={"sm"}
      variant={"ghost"}
      onClick={() => {
        setActiveRequest(updatedRequest ?? request);
      }}
      onDoubleClick={() => {}}
    >
      <span
        className={cn(
          "text-[10px] rounded-sm w-10 text-center p-[2px]",
          methodColors[request.method],
          methodBgColors[request.method],
        )}
      >
        {request.method}
      </span>
      {isEditing ? (
        <Input
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          variant={"sm"}
        />
      ) : (
        <div onDoubleClick={handleDoubleClick}>{text}</div>
      )}
    </Button>
  );
};

export default RequestButton;
