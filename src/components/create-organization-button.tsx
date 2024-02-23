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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  createOrganization,
  getOrganization,
  joinOrganization,
} from "@/actions/organization";

const CreateOrganizationButton = ({ orgName }: { orgName?: string }) => {
  const [name, setName] = useState(orgName ?? "");
  const [description, setDescription] = useState("");
  const [orgAlreadyCreated, setOrgAlreadyCreated] = useState(false);

  const session = useSession();

  const handleSubmit = async () => {
    if (!name || !description) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      // if (orgName === "gmail" || name === "gmail") {
      //   toast.error("Use your own organization name");
      //   return;
      // }

      const response = await createOrganization({
        name: orgName ?? name,
        description,
        createdById: session.data?.user.id,
      });

      if (response === "ALREADY_CREATED") {
        toast.error("Organization already created");
        return;
      }

      if (response.id) {
        toast.success("Organization Created Successfully!");
      }
    } catch (error) {
      toast.error("Failed to create organization");
    }
  };

  const checkOrgPresence = async () => {
    if (!orgName) return;

    const response = await getOrganization(orgName);
    console.log(response);

    if (response?.name === orgName) {
      setOrgAlreadyCreated(true);
    }
  };

  const join = async () => {
    const response = await joinOrganization({ orgName });

    if (response === "ALREADY_JOINED") {
      toast.warning("You have already joined your organization");
      return;
    } else if (response === "JOIN_SUCCESS") {
      toast.success("Joined Successfully");
      return;
    }
  };

  useEffect(() => {
    checkOrgPresence();
  }, []);

  if (orgAlreadyCreated && !session.data?.user.organizationId) {
    return <Button onClick={join}>Join Your Organization</Button>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Organization</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new organization.
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
              onChange={(e) => {
                setName(e.target.value);
              }}
              disabled={Boolean(orgName)}
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
          <Button onClick={handleSubmit}>Create Organization</Button>
        </DialogFooter>
      </DialogContent>{" "}
    </Dialog>
  );
};

export default CreateOrganizationButton;
