import { Request } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RequestsState {
  requests: Request[];
  activeRequest: Request | null;
  requestsHistory: Request[];
  setRequests: (requests: Request[]) => void;
  // addRequest: (request: Request) => void;
  addUpdatedRequest: (request: Request) => void;
  closeRequest: (request: Request) => void;
  setActiveRequest: (request: Request) => void;
}

export const useRequestsStore = create<RequestsState>()(
  devtools((set) => ({
    requests: [],
    activeRequest: null,
    requestsHistory: [],
    setRequests: (requests) => set({ requests }),
    // addRequest: (request) =>
    //   set((state) => ({
    //     requests: Array.from(new Set([...state.requests, request])),
    //     activeRequest: request,
    //     requestsHistory: state.activeRequest
    //       ? [...state.requestsHistory, state.activeRequest]
    //       : state.requestsHistory,
    //   })),
    addUpdatedRequest: (request) =>
      set((state) => ({
        requests: state.requests.map((r) =>
          r.id === request.id ? request : r,
        ),
      })),
    closeRequest: (request) =>
      set((state) => {
        return {
          requests: state.requests
            .filter((r) => r.id !== request.id)
            .filter(Boolean),
          activeRequest: state.requestsHistory.pop(),
          requestsHistory: state.requestsHistory.filter(Boolean),
        };

        // const newRequests = state.requests.filter((r) => r.id !== request.id);
        // const newHistory = state.requestsHistory.filter(
        //   (r) => r.id !== request.id,
        // );
        // const newActiveRequest =
        //   state.activeRequest && state.activeRequest.id === request.id
        //     ? state.requestsHistory.length > 0
        //       ? state.requestsHistory.pop()
        //       : newRequests.length > 0
        //       ? newRequests[newRequests.length - 1]
        //       : null
        //     : state.activeRequest;
        // return {
        //   requests: newRequests,
        //   activeRequest: newActiveRequest,
        //   requestsHistory: [
        //     ...state.requestsHistory,
        //     state.activeRequest,
        //   ].filter(Boolean),
        // };
      }),
    setActiveRequest: (request) =>
      set((state) => ({
        requests: Array.from(new Set([...state.requests, request])),
        activeRequest: request,
        requestsHistory: state.activeRequest
          ? Array.from(
              new Set([
                ...state.requestsHistory.filter((r) => r.id !== request.id),
                state.activeRequest,
              ]),
            )
          : state.requestsHistory,
      })),
  })),
);
