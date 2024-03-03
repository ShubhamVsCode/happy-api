"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { RequestMethod as Method, Request } from "@prisma/client";
import { useRequestsStore } from "@/store";
import useEditableText from "@/hooks/useEditableText";
import { Input } from "../ui/input";
import { deleteRequest, updateRequest } from "@/actions/request";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

const methodColors = {
  [Method.GET]: "text-green-500",
  [Method.POST]: "text-yellow-600",
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
  const { activeRequest, setActiveRequest, addUpdatedRequest, closeRequest } =
    useRequestsStore();
  const [updatedRequest, setUpdatedRequest] = useState<Request>(request);

  const onDoubleClick = () => {};
  const onBlur = async () => {
    if (request.name == text) return;
    const updatedReq = await updateRequest({
      ...request,
      id: request.id,
      name: text,
    });
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

  const handleDelete = async () => {
    if (!request?.id) return;
    await deleteRequest(request?.id);
    closeRequest(request);

    toast.success("Request Deleted");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          className={`w-full group text-left items-center justify-start grid grid-cols-[50px_1fr] pl-2`}
          size={"sm"}
          variant={activeRequest?.id === request.id ? "default" : "ghost"}
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
              className="text-black"
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              className="flex justify-between items-center w-[10.2rem]"
            >
              <span className="truncate">{text}</span>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="hidden group-hover:block h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                    <DropdownMenuShortcut>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        <ContextMenuItem onClick={handleDoubleClick}>Rename</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RequestButton;
