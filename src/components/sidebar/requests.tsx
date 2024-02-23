"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import RequestButton from "./request-button";
import { PlusIcon } from "lucide-react";
import { Folder, Request } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { createFolder } from "@/actions/folder";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { createNewRequest } from "@/actions/request";
import { useRequestsStore } from "@/store/requests";

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
  const { requests, addRequest, setRequests } = useRequestsStore();

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
      addRequest(newRequest);
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

      {/* <pre>
        {JSON.stringify(initialFolders, null, 2)}
        {JSON.stringify(initialRequests, null, 2)}
      </pre> */}

      <div className="mt-2">
        <Accordion type="multiple">
          {allFolders?.map((folder) => (
            <AccordionItem value={folder.id}>
              <AccordionTrigger>{folder.name}</AccordionTrigger>
              <AccordionContent>
                {folder.requests.length === 0 ? (
                  <Button
                    onClick={() => handleNewRequest(folder.id)}
                    className="text-blue-700 w-full"
                    variant={"link"}
                  >
                    Add new request
                  </Button>
                ) : (
                  folder.requests?.map((req) => (
                    <RequestButton name={req.name} method={req.method} />
                  ))
                )}
              </AccordionContent>
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

              {/* <AccordionContent>
                <RequestButton name="Login" method={Method.POST} />
                <RequestButton name="Register" method={Method.POST} />
                <RequestButton name="Get User" method={Method.GET} />
                <RequestButton name="Delete User" method={Method.DELETE} />
                <RequestButton name="Update User" method={Method.PUT} />
                <RequestButton name="Update User By Id" method={Method.PATCH} />
              </AccordionContent> */}
            </AccordionItem>
          </Accordion>
        )}

        {/* <Accordion type="single" collapsible>
          <AccordionItem value="auth">
            <AccordionTrigger>Auth</AccordionTrigger>
            <AccordionContent>
              <RequestButton name="Login" method={Method.POST} />
              <RequestButton name="Register" method={Method.POST} />
              <RequestButton name="Get User" method={Method.GET} />
              <RequestButton name="Delete User" method={Method.DELETE} />
              <RequestButton name="Update User" method={Method.PUT} />
              <RequestButton name="Update User By Id" method={Method.PATCH} />
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
    </>
  );
};

export default Requests;
