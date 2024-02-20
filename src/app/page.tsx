import MiniSidebar from "@/components/mini-sidebar";
import Main from "@/components/main";

export default function Component() {
  return (
    <div className="flex min-h-screen w-full">
      <MiniSidebar />
      <Main />
    </div>
  );
}
