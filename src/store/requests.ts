import { Request } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RequestsState {
  requests: Request[];
  activeRequest: Request | null;
  requestsHistory: Request[];
  setRequests: (requests: Request[]) => void;
  addUpdatedRequest: (request: Request) => void;
  closeRequest: (request: Request) => void;
  setActiveRequest: (request: Request) => void;
  goToNextRequest: (isNext: Boolean) => void;
}

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set) => ({
      requests: [],
      activeRequest: null,
      requestsHistory: [],
      setRequests: (requests) => set({ requests }),
      addUpdatedRequest: (request) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === request.id ? request : r,
          ),
        })),
      closeRequest: (request) =>
        set((state) => {
          const updatedRequests = state.requests
            .filter((r) => r.id !== request.id)
            .filter(Boolean);

          const updatedHistory = state.requestsHistory.filter(
            (r) => r.id !== request.id,
          );

          const newActiveRequest =
            updatedHistory.length > 0
              ? updatedHistory[updatedHistory.length - 1]
              : null;

          return {
            requests: updatedRequests,
            activeRequest: newActiveRequest,
            requestsHistory: updatedHistory,
          };
        }),
      setActiveRequest: (request) =>
        set((state) => ({
          requests:
            state.requests.findIndex((r) => r.id === request.id) === -1
              ? [...state.requests, request]
              : state.requests,
          activeRequest:
            state.activeRequest?.id === request.id
              ? state.activeRequest
              : request,
          requestsHistory: state.activeRequest
            ? Array.from(
                new Set([
                  ...state.requestsHistory.filter((r) => r.id !== request.id),
                  state.activeRequest,
                ]),
              )
            : state.requestsHistory,
        })),

      goToNextRequest: (isNext) =>
        set((state) => {
          if (!state.activeRequest) return {};

          const activeRequestIndex = state.requests.indexOf(
            state.activeRequest,
          );
          const nextIndex = isNext
            ? (activeRequestIndex + 1) % state.requests.length
            : activeRequestIndex - 1 < 0
            ? state.requests.length - 1
            : activeRequestIndex - 1;

          const request = state.requests[nextIndex];
          const updatedHistory = Array.from(
            new Set([
              ...state.requestsHistory.filter((r) => r.id !== request.id),
              state.activeRequest,
            ]),
          );

          return {
            activeRequest: request,
            requestsHistory: updatedHistory,
          };
        }),
    }),
    {
      name: "REQUEST-STORE",
    },
  ),
);
