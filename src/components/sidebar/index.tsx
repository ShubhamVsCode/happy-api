import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import RequestButton, { Method } from "./request-button";
import { PlusIcon } from "lucide-react";

const Sidebar = () => {
  return (
    <>
      <div>
        <Button size={"sm"} variant={"outline"} className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      <div className="mt-2">
        <Accordion type="single" collapsible>
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
        </Accordion>
      </div>
    </>
  );
};

export default Sidebar;
