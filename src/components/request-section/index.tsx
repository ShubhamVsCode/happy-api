"use client";

import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";

import { json } from "@codemirror/lang-json";
import { ChangeEvent, FormEvent, useState } from "react";
import { Method } from "@/components/sidebar/request-button";
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

import axios from "axios";

const RequestSection = () => {
  const [BASE_URL] = useState("https://jsonplaceholder.typicode.com");

  const [method, setMethod] = useState(Method.GET);
  const [url, setUrl] = useState("/");
  const [requestBody, setRequestBody] = useState({
    name: "",
    age: 0,
  });
  const [response, setResponse] = useState<any>();

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log({ method, url, requestBody });

    // fetch(`${BASE_URL}${url}`, {
    //   method,
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Allow-Control-Allow-Origin": "*",
    //   },
    //   body: JSON.stringify(requestBody),
    // })
    //   .then((res) => {
    //     console.log({ res });
    //     if (res.ok) {
    //       return res.json();
    //     }
    //   })
    //   .then((res) => {
    //     setResponse(res);
    //   })
    //   .catch((err) => {
    //     console.log({ err });
    //   });

    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${url}`,
        data: requestBody,
      });

      setResponse(response.data);

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  }

  function handleMethodChange(value: string): void {
    setMethod(value as Method);
  }

  function handleBaseUrlChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>): void {
    setUrl(event.target.value);
  }

  return (
    <div>
      <form onSubmit={handleRequest} className="flex items-center gap-2">
        <Select
          defaultValue={Method.GET}
          value={method}
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
          defaultValue={BASE_URL}
          value={BASE_URL}
          onValueChange={handleBaseUrlChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"BASE_URL"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BASE_URL}>BASE_URL</SelectItem>
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
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="params">Params</TabsTrigger>
            </TabsList>
            <TabsContent value="body">
              <CodeMirror
                theme={githubDark}
                value={JSON.stringify(requestBody, null, 2)}
                height="580px"
                className="rounded-md overflow-hidden"
                extensions={[json()]}
                onChange={(value) => setRequestBody(JSON.parse(value || ""))}
              />
            </TabsContent>
            <TabsContent value="headers">Headers</TabsContent>
            <TabsContent value="auth">Auth</TabsContent>
            <TabsContent value="params">Params</TabsContent>
          </Tabs>
        </div>
        <div className="">
          <Tabs defaultValue="response-body" className="">
            <TabsList>
              <TabsTrigger value="response-body">Response</TabsTrigger>
              <TabsTrigger value="response-headers">
                Response Headers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="response-body">
              <CodeMirror
                editable={false}
                theme={githubDark}
                value={JSON.stringify(response, null, 2)}
                height="580px"
                className="rounded-md overflow-hidden"
                extensions={[json()]}
              />
            </TabsContent>
            <TabsContent value="response-headers">Response Headers</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RequestSection;
