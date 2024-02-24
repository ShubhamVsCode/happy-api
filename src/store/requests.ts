import { Request } from "@prisma/client";
import { create } from "zustand";

interface RequestsState {
  requests: Request[];
  activeRequest: Request | null;
  lastActiveRequest: Request | null;
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
  addUpdatedRequest: (request: Request) => void;
  closeRequest: (request: Request) => void;
  setActiveRequest: (request: Request) => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  requests: [],
  activeRequest: null,
  lastActiveRequest: null,
  setRequests: (requests) =>
    set({
      requests: Array.from(new Set(requests)),
      activeRequest: requests?.[0],
    }),
  addRequest: (request) =>
    set((state) => ({
      requests:
        state.requests.findIndex((r) => r.id === request.id) !== -1
          ? state.requests
          : Array.from(new Set([...state.requests, request])),
      activeRequest: request,
    })),
  addUpdatedRequest: (request) =>
    set((state) => ({
      requests: state.requests.map((r) => {
        return r.id === request.id ? request : r;
      }),
    })),
  closeRequest: (request) =>
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== request.id),
      activeRequest:
        state.activeRequest && state.activeRequest.id === request.id
          ? state.requests.find(
              (r) =>
                r.id === (state.lastActiveRequest && state.lastActiveRequest.id)
            )
          : state.activeRequest,

      // state.activeRequest?.id !== request?.id
      //   ? state.activeRequest
      //   : state.lastActiveRequest,
    })),
  setActiveRequest: (request) =>
    set((state) => ({
      activeRequest: request,
      lastActiveRequest: state.activeRequest,
    })),
}));
