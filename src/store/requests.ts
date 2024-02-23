import { Request } from "@prisma/client";
import { create } from "zustand";

interface RequestsState {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => ({ requests: [...state.requests, request] })),
}));
