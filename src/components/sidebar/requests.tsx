"use client";

import { useEffect, useRef, useState } from "react";
import { Folder, Request } from "@prisma/client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import RequestButton from "./request-button";
import { MoreVertical, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { createFolder, deleteFolder } from "@/actions/folder";
import { createNewRequest } from "@/actions/request";
import { useFolderStore, useRequestsStore } from "@/store";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type FolderWithRequests = Folder & {
  requests: Request[];
};

const Requests = ({
  collectionId,
  initialFolders,
  initialRequests,
}: {
  collectionId?: string;
  initialFolders?: FolderWithRequests[];
  initialRequests?: Request[];
}) => {
  const newFolderData = {
    name: "New Folder",
    description: "",
  };

  const [editingFolder, setEditingFolder] = useState(false);
  const [newFolderCreating, setNewFolderCreating] = useState(false);
  const [newFolder, setNewFolder] = useState<{
    name: string;
    description?: string;
  } | null>(null);
  const newFolderRef = useRef<HTMLInputElement>(null);
  const [allFolders, setAllFolders] = useState<FolderWithRequests[]>(
    initialFolders || [],
  );
  const [allRequests, setAllRequests] = useState<Request[]>(
    initialRequests || [],
  );
  const { activeRequest, setActiveRequest } = useRequestsStore();
  const { openedFolders, setOpenedFolders } = useFolderStore();

  const handleNewFolder = async () => {
    setNewFolder(newFolderData);
    setEditingFolder(true);
  };

  useEffect(() => {
    if (newFolderRef.current) {
      newFolderRef.current?.focus();
      newFolderRef.current.select();
    }

    return () => {};
  }, [editingFolder]);

  const handleFolderCreate = async () => {
    if (!newFolder) return;

    setNewFolderCreating(true);
    const folder = await createFolder({
      ...newFolder,
      collectionId: collectionId ?? "",
    });
    setNewFolderCreating(false);
    setEditingFolder(false);
    setNewFolder(null);
    setAllFolders((prev) => [...prev, folder]);
    toast.success(newFolder.name + " Created");
  };

  const handleNewRequest = async (folderId?: string) => {
    const newRequest = await createNewRequest({
      name: "New Request",
      collectionId: collectionId ?? "",
      folderId,
    });

    if (newRequest) {
      toast.success("Request Created");
      setActiveRequest(newRequest);
    }
  };

  const handleFolderDelete = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      toast.success("Folder deleted!");
    } catch (error) {
      console.log("error in deleting folder", error);
      toast.error("Folder not able to delete");
    }
  };

  return (
    <>
      <Button
        onClick={handleNewFolder}
        size={"sm"}
        variant={"outline"}
        className="w-full"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        New Folder
      </Button>

      <pre>
        {/* {JSON.stringify(initialFolders, null, 2)}
        {JSON.stringify(initialRequests, null, 2)} */}
      </pre>

      <ScrollArea className="h-[600px] mt-2">
        <ScrollBar orientation="vertical" />
        <div className="">
          <Accordion
            type="multiple"
            onValueChange={(value) => setOpenedFolders(value)}
            value={
              activeRequest && activeRequest?.folderId
                ? openedFolders.includes(activeRequest.folderId)
                  ? openedFolders
                  : [...openedFolders, activeRequest.folderId]
                : openedFolders
            }
          >
            {initialFolders?.map((folder) => (
              <AccordionItem value={folder.id} key={folder.id}>
                <ContextMenu>
                  <ContextMenuContent>
                    {/* <ContextMenuItem>Save</ContextMenuItem> */}
                    {/* <ContextMenuItem>Rename</ContextMenuItem> */}
                    <ContextMenuItem>Rename Folder</ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleFolderDelete(folder.id)}
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                  <ContextMenuTrigger>
                    <AccordionTrigger className="group w-full">
                      <span className="truncate">{folder.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto mr-1">
                          <MoreVertical className="hidden group-hover:block h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleNewRequest(folder.id)}
                          >
                            Add Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </AccordionTrigger>
                    <AccordionContent>
                      {folder.requests.length === 0 ? (
                        <Button
                          onClick={() => handleNewRequest(folder.id)}
                          className="w-full mt-1 text-sm py-1"
                          variant={"ghost"}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" /> Add new request
                        </Button>
                      ) : (
                        <>
                          {folder.requests?.map((req) => (
                            <RequestButton
                              key={req.id + req.name + req.collectionId}
                              request={req}
                            />
                          ))}
                          <Button
                            onClick={() => handleNewRequest(folder.id)}
                            className="w-full text-sm"
                            size={"sm"}
                            variant={"ghost"}
                          >
                            <PlusIcon className="mr-2 h-4 w-4" /> Add new
                            request
                          </Button>
                        </>
                      )}
                    </AccordionContent>
                  </ContextMenuTrigger>
                </ContextMenu>
              </AccordionItem>
            ))}
          </Accordion>

          {newFolder && (
            <Accordion type="single" collapsible>
              <AccordionItem value={newFolder.name}>
                <AccordionTrigger
                  data-state={editingFolder && "open"}
                  onClick={(e) => {
                    editingFolder && e.preventDefault();
                  }}
                  onDoubleClick={() => setEditingFolder(true)}
                >
                  {editingFolder ? (
                    <Input
                      ref={newFolderRef}
                      type="text"
                      variant={"sm"}
                      value={newFolder.name}
                      disabled={newFolderCreating}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleFolderCreate();
                        }
                      }}
                      onChange={(e) => {
                        setNewFolder((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        handleFolderCreate();
                      }}
                    />
                  ) : (
                    newFolder.name
                  )}
                </AccordionTrigger>
                <AccordionContent className="grid place-content-center h-20">
                  <Button
                    // onClick={() => handleNewRequest(folder.id)}
                    className="text-blue-700 w-full"
                    variant={"link"}
                  >
                    Add new request
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default Requests;
