import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FolderState {
  openedFolders: string[];
  setOpenedFolders: (openedFolders: string[]) => void;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set) => ({
      openedFolders: [],
      setOpenedFolders: (openedFolders) => set({ openedFolders }),
    }),
    {
      name: "FOLDER-STORE",
    },
  ),
);
