import Sidebar from "./sidebar";
import RequestSection from "./request-section";
import Header from "./header";

const Main = () => {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <main className="flex flex-1">
        <section className="w-[250px] p-2 border-r">
          <Sidebar />
        </section>
        <section className="flex-1 flex-col p-2">
          <RequestSection />
        </section>
      </main>
    </div>
  );
};

export default Main;
