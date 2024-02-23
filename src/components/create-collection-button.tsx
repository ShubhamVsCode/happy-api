"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createCollection } from "@/actions/collection";
import { useSession } from "next-auth/react";

const CreateCollectionButton = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const session = useSession();

  const handleSubmit = async () => {
    if (!name || !description) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const response = await createCollection({
        name,
        description,
        organizationId: session?.data?.user?.organizationId || undefined,
      });

      console.log("Response", response);

      toast.success("Successfully Created Collection");
      setOpen(false);
      return;
    } catch (error) {
      toast.error("Failed to create collection");
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Collection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new collection</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new collection.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild tabIndex={-1}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Collection</Button>
        </DialogFooter>
      </DialogContent>{" "}
    </Dialog>
  );
};

export default CreateCollectionButton;
