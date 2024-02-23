"use client";
import { logout } from "@/actions/auth";

const Logout = () => {
  return (
    <button
      onClick={async () => {
        await logout();
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
