import { Request } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RequestsState {
  requests: Request[];
  activeRequest: Request | null;
  unsavedRequest: Request | Partial<Request> | null;
  requestsHistory: Request[];
  setRequests: (requests: Request[]) => void;
  setUnsavedRequest: (request: Request | Partial<Request> | null) => void;
  addUpdatedRequest: (request: Request) => void;
  closeRequest: (request: Request) => void;
  setActiveRequest: (request: Request) => void;
  removeActiveRequest: () => void;
  goToNextRequest: (isNext: Boolean) => void;
}

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      activeRequest: null,
      unsavedRequest: null,
      requestsHistory: [],
      setRequests: (requests) => set({ requests }),
      setUnsavedRequest: (request) =>
        set((state) => ({
          unsavedRequest: state.unsavedRequest
            ? { ...state.unsavedRequest, ...request }
            : request,
        })),
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

          if (state.activeRequest?.id === request.id) {
            newActiveRequest && get().setActiveRequest(newActiveRequest);
          }

          if (!newActiveRequest) {
            get().removeActiveRequest();
          }

          return {
            requests: updatedRequests,
            requestsHistory: updatedHistory,
          };
        }),
      setActiveRequest: (request) => {
        get().setUnsavedRequest(request);

        return set((state) => ({
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
        }));
      },
      removeActiveRequest: () =>
        set((state) => ({ activeRequest: null, unsavedRequest: null })),
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

// startDevtools();

// function startDevtools() {
//   const connection = window?.__REDUX_DEVTOOLS_EXTENSION__?.connect({
//     name: "Form fields",
//   });
//   connection?.init(useRequestsStore.getState());

//   let isUpdateFromDevtools = false;
//   connection?.subscribe((evt: any) => {
//     if (evt.type === "DISPATCH") {
//       const newState = JSON.parse(evt.state);
//       isUpdateFromDevtools = true;
//       useRequestsStore.setState(newState);
//       isUpdateFromDevtools = false;
//     }
//   });

//   useRequestsStore.subscribe((newState) => {
//     if (!isUpdateFromDevtools) {
//       connection?.send("State", newState);
//     }
//   });
// }
