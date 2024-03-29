import { getOrganizationCollection } from "@/actions/collection";
import Requests from "./requests";

const Sidebar = async () => {
  const response = await getOrganizationCollection();
  const collection = response?.at(0);

  return (
    <div>
      {collection && <p>{collection?.name}</p>}
      <div className="mt-2 flex flex-col">
        <Requests
          collectionId={collection?.id}
          initialRequests={collection?.requests}
          initialFolders={collection?.folders}
        />
      </div>
    </div>
  );
};

export default Sidebar;
