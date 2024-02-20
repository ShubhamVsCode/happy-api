import { CodeIcon, HomeIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const MiniSidebar = () => {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-[60px]">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b justify-center">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            {/* <ActivityIcon className="h-6 w-6" /> */}
            <span className="">API</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {/* <Link
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
              href="#"
            >
              <HomeIcon className="h-4 w-4" />
            </Link> */}
            <Link
              //   className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
              href="#"
            >
              <CodeIcon className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MiniSidebar;
