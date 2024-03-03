import { NextRequest, NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json([
    {
      id: 1,
      name: "John",
      age: 30,
    },
    {
      id: 2,
      name: "Jane",
      age: 25,
    },
  ]);
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  return NextResponse.json({
    id: 1,
    name: data?.name,
    age: data?.age,
  });
};
