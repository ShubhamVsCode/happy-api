import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { RequestMethod as Method } from "@prisma/client";

interface RequestButtonProps {
  name: string;
  method: Method;
}

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

const RequestButton = (props: RequestButtonProps) => {
  return (
    <Button
      className={`w-full text-left items-center justify-start grid grid-cols-[50px_1fr] pl-2`}
      size={"sm"}
      variant={"ghost"}
    >
      <span
        className={cn(
          "text-[10px] rounded-sm w-10 text-center p-[2px]",
          methodColors[props.method],
          methodBgColors[props.method],
        )}
      >
        {props.method}
      </span>
      <span className="text-sm">{props.name}</span>
    </Button>
  );
};

export default RequestButton;
