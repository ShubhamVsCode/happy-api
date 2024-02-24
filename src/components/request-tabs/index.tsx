import Tabs from "./tabs";

const RequestTabs = () => {
  return (
    <div className="flex w-full justify-between">
      <nav className="flex gap-4">
        <Tabs />
      </nav>
      {/* <div className="p-4">{tabs[activeTab].content}</div> */}
    </div>
  );
};

export default RequestTabs;
