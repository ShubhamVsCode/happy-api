import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MenuIcon, SearchIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CreateCollectionButton from "./create-collection-button";
import Logout from "./logout";
import Link from "next/link";
import CreateOrganizationButton from "./create-organization-button";
import { getOrganizationCollection } from "@/actions/collection";
import RequestTabs from "./request-tabs";
import Environment from "./environment";

const Header = async () => {
  const session = await auth();
  const email = session?.user?.email;

  const response = await getOrganizationCollection();
  const collection = response?.at(0);

  const organizationName = email?.substring(
    email?.lastIndexOf("@") + 1,
    email?.lastIndexOf("."),
  );

  return (
    <header className="flex justify-between h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Button className="lg:hidden" variant="ghost">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="w-[209.5px] flex">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            className="w-full bg-white shadow-none appearance-none pl-8 dark:bg-gray-950"
            placeholder="Search endpoints..."
            type="search"
          />
        </div>
      </div>
      <div className="flex-1 border-l flex h-full">
        <RequestTabs />
      </div>

      <div>
        {session?.user?.organizationId ? (
          !collection?.id ? (
            <CreateCollectionButton />
          ) : (
            <Environment />
          )
        ) : (
          <CreateOrganizationButton orgName={organizationName} />
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
            size="icon"
            variant="ghost"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user?.image as string} />
              <AvatarFallback>{session?.user?.name?.at(0)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          {session?.user?.organizationId && (
            <DropdownMenuItem>
              <Link href={"/organization"}>Organization</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
