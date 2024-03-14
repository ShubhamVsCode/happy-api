"use client";

import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import contentType from "content-type";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestMethod as Method, Request, Variable } from "@prisma/client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRequestsStore } from "@/store";
import { updateRequest } from "@/actions/request";
import { Edit, Loader2Icon, PencilIcon, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { useSession } from "next-auth/react";
import {
  createVariable,
  getAllVariablesOfOrganization,
  updateVariable,
} from "@/actions/variables";

const initialNewVariable = {
  name: "",
  value: "",
  previousValues: [],
  environmentId: null,
  organizationId: null,
};

const RequestSection = () => {
  const { activeRequest, unsavedRequest, setUnsavedRequest, setActiveRequest } =
    useRequestsStore();

  const session = useSession();

  const [requesting, setRequesting] = useState(false);
  const [baseUrlSelectOpen, setBaseUrlSelectOpen] = useState(false);
  const [openVariableModel, setOpenVariableModel] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [newVariable, setNewVariable] =
    useState<Omit<Variable, "id">>(initialNewVariable);

  const [selectedVariable, setSelectedVariable] = useState<Variable | null>();
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [responseContentType, setResponseContentType] = useState<string>("");

  const {
    id,
    name,
    method,
    variableId,
    url,
    body,
    response,
    status,
    duration,
  } = unsavedRequest || {};

  // const [method, setMethod] = useState<Method>(
  //   activeRequest?.method ?? Method.GET,
  // );
  // const [url, setUrl] = useState(activeRequest?.url ?? "/");
  // const [requestBody, setRequestBody] = useState(activeRequest?.body ?? {});
  // const [response, setResponse] = useState<any>(activeRequest?.response);

  const handleRequest = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      if (requesting) return;
      event?.preventDefault();

      try {
        setRequesting(true);
        const startTime = performance.now();
        const response = await axios({
          method,
          url: `${selectedVariable?.value}${url}`,
          data: body,
        });
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;

        const resContentType = contentType.parse(
          response?.headers["content-type"] as string,
        );
        setResponseContentType(resContentType.type);

        setUnsavedRequest({
          response: response.data,
          status: response.status,
          duration: elapsedTime,
        });

        console.log({ response });
      } catch (error) {
        console.log({ error });
        if (error instanceof AxiosError) {
          const resContentType = contentType.parse(
            error.response?.headers["content-type"] as string,
          );
          setResponseContentType(resContentType.type);

          setUnsavedRequest({
            response:
              error.response?.status === 404
                ? error.response?.statusText
                : error.response?.data,
            status: error.response?.status,
          });
        }
        toast.error("Request failed");
      } finally {
        setRequesting(false);
      }
    },
    [selectedVariable, body, method, setUnsavedRequest, url, requesting],
  );

  function handleMethodChange(value: Method): void {
    setUnsavedRequest({ method: value });
  }

  function handleBaseUrlChange(id: string): void {
    setSelectedVariable(variables.find((v) => v.id === id) ?? null);
    setUnsavedRequest({ variableId: id });
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>): void {
    setUnsavedRequest({ url: event.target.value });
  }

  const handleSaveRequest = useCallback(async () => {
    const request = await updateRequest(unsavedRequest as Request);
    if (request.id) {
      toast.success("Saved Request");
      setUnsavedRequest(request);
      setActiveRequest(request);
    }
  }, [unsavedRequest, setActiveRequest, setUnsavedRequest]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const isCtrl = event.ctrlKey || event.metaKey;
      if (isCtrl && event.key === "s") {
        event.preventDefault();
        handleSaveRequest();
      }

      if (isCtrl && event.key === "Enter") {
        event.preventDefault();
        handleRequest();
      }
    },
    [handleRequest, handleSaveRequest],
  );

  const handleCreateNewVariable = async () => {
    if (!session.data?.user.organizationId) return;
    if (!newVariable.name || !newVariable.value) {
      toast.error("Name and value are required");
      return;
    }

    try {
      const variable = await createVariable({
        ...newVariable,
        organizationId: session.data?.user?.organizationId,
      });

      setVariables([...variables, variable]);
      setNewVariable(initialNewVariable);
      toast.success("Variable created");
    } catch (error) {
      console.log({ error });
      toast.error("Failed to create variable");
    }
  };

  const handleUpdateVariable = async () => {
    if (!session.data?.user.organizationId) return;
    if (!editingVariable) return;

    try {
      const variable = await updateVariable(editingVariable);

      setVariables(variables.map((v) => (v.id === variable.id ? variable : v)));
      setEditingVariable(null);
      toast.success("Variable updated");
    } catch (error) {
      console.log({ error });
      toast.error("Failed to update variable");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    async function getVaribles() {
      if (!session.data?.user.organizationId) return;
      const vars = await getAllVariablesOfOrganization(
        session.data?.user?.organizationId,
      );
      setSelectedVariable(
        variableId ? vars.find((v) => v.id === variableId) : vars[0],
      );
      setVariables(vars);
    }
    getVaribles();
  }, [session.data?.user.organizationId]);

  useEffect(() => {
    if (variableId) {
      setSelectedVariable(variables.find((v) => v.id === variableId) ?? null);
    } else {
      setSelectedVariable(variables[0] ?? null);
    }
  }, [variableId]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRequest(e);
        }}
        className="flex items-center gap-2"
      >
        <Select
          defaultValue={Method.GET}
          value={method ?? Method.GET}
          onValueChange={handleMethodChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={"Method"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Method.GET}>GET</SelectItem>
            <SelectItem value={Method.POST}>POST</SelectItem>
            <SelectItem value={Method.PUT}>PUT</SelectItem>
            <SelectItem value={Method.PATCH}>PATCH</SelectItem>
            <SelectItem value={Method.DELETE}>DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={variables?.[0]?.id}
          value={variableId || selectedVariable?.id}
          onValueChange={handleBaseUrlChange}
          open={baseUrlSelectOpen}
          onOpenChange={setBaseUrlSelectOpen}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"BASE_URL"} />
          </SelectTrigger>
          <SelectContent>
            {variables?.map((variable) => (
              <SelectItem key={variable.id} value={variable.id}>
                {variable.name}
              </SelectItem>
            ))}
            <Button
              onClick={() => {
                setBaseUrlSelectOpen(false);
                setOpenVariableModel(true);
              }}
              variant={"outline"}
              size={"sm"}
              className="w-full mt-1"
            >
              <PencilIcon className="w-4 h-4 mr-2" /> Edit
            </Button>
          </SelectContent>
        </Select>

        <Input
          className="flex-1"
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
        <Button type="submit">Send</Button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div className="">
          <Tabs defaultValue="body" className="">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger disabled value="headers">Headers</TabsTrigger>
              <TabsTrigger disabled value="auth">Auth</TabsTrigger>
              <TabsTrigger disabled value="params">Params</TabsTrigger>
            </TabsList>

            <TabsContent value="body">
              <CodeMirror
                theme={githubDark}
                editable={!requesting}
                value={body == null ? "" : JSON.stringify(body, null, 2)}
                height="580px"
                className="rounded-md overflow-hidden"
                extensions={[json()]}
                onChange={(value, view) => {
                  setUnsavedRequest({ body: JSON.parse(value || "") });
                }}
              />
            </TabsContent>
            <TabsContent value="headers">Headers</TabsContent>
            <TabsContent value="auth">Auth</TabsContent>
            <TabsContent value="params">Params</TabsContent>
          </Tabs>
        </div>
        <div className="">
          <Tabs defaultValue="response-body" className="">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="response-body">Response</TabsTrigger>
                <TabsTrigger disabled value="response-headers">
                  Response Headers
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2 text-sm">
                {status && (
                  <p>
                    Status:{" "}
                    {status < 400 ? (
                      <span className="text-green-600">{status} OK</span>
                    ) : (
                      <span className="text-yellow-600">{status}</span>
                    )}
                  </p>
                )}
                {duration && <p>Time: {duration?.toLocaleString()}ms</p>}
              </div>
            </div>
            <TabsContent value="response-body" className="relative">
              <CodeMirror
                editable={false}
                theme={githubDark}
                value={
                  response == null
                    ? ""
                    : responseContentType !== "html/text"
                    ? JSON.stringify(response, null, 2)
                    : (response as string)
                }
                height="580px"
                className="rounded-md overflow-hidden"
                extensions={[json()]}
              />

              {requesting && (
                <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2Icon className="size-10 animate-spin" />
                  <p>Requesting...</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="response-headers">Response Headers</TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={openVariableModel} onOpenChange={setOpenVariableModel}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              <div className="flex items-center">Edit Variables</div>
            </DialogTitle>
            <DialogDescription>
              Edit the variables that will be used in the request.
            </DialogDescription>

            <div className="min-h-40 space-y-2">
              {variables.map((v) => {
                const isEditing = editingVariable?.id === v.id;

                if (isEditing) {
                  return (
                    <div
                      key={v.id}
                      className="grid grid-cols-5 gap-4 place-content-center"
                    >
                      <Input
                        placeholder="Variable Name"
                        className="col-span-1"
                        value={editingVariable.name}
                        onChange={(e) => {
                          setEditingVariable((prev) => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              name: e.target.value,
                            };
                          });
                        }}
                      />
                      <Input
                        placeholder="Value"
                        className="col-span-3"
                        value={editingVariable.value}
                        onChange={(e) => {
                          setEditingVariable((prev) => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              value: e.target.value,
                            };
                          });
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleUpdateVariable}>Save</Button>
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            setEditingVariable(null);
                          }}
                        >
                          <XCircle />
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={v.id}
                    className="grid grid-cols-5 gap-4 place-content-center"
                  >
                    <Label htmlFor={v.name} className="self-center">
                      {v.name}
                    </Label>
                    <Input
                      id={v.name}
                      className="col-span-3"
                      value={v.value}
                      onChange={(e) => {}}
                      disabled={editingVariable?.id !== v.id}
                    />
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setEditingVariable(v);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                );
              })}
              <div className="grid grid-cols-5 gap-4 place-content-center">
                <Input
                  placeholder="Variable Name"
                  className="col-span-1"
                  value={newVariable.name}
                  onChange={(e) => {
                    setNewVariable((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
                <Input
                  placeholder="Value"
                  className="col-span-3"
                  value={newVariable.value}
                  onChange={(e) => {
                    setNewVariable((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }));
                  }}
                />
                <Button onClick={handleCreateNewVariable}>Save</Button>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"secondary"}
              onClick={() => setOpenVariableModel(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestSection;
